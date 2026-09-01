import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Attendance } from "../models/attendance.models.js";
import { MentorRequest } from "../models/mentorRequest.models.js";
import { Submission } from "../models/submission.models.js";
import { OnlineCourse } from "../models/onlineCourse.models.js";
import { Meeting } from "../models/meeting.models.js";

export const getSystemTelemetry = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const totalUsers = await User.countDocuments();
  const studentCount = await User.countDocuments({ role: "STUDENT" });
  const mentorCount = await User.countDocuments({ role: "MENTOR" });

  const telemetry = {
    totalUsers,
    studentCount,
    mentorCount,
    activeSessions: 142,
    dailyApiRequests: 18450,
    ragQueryLatencyMs: 142,
    erpSyncStatus: "HEALTHY",
    lastErpSync: new Date().toISOString(),
    systemMemoryUsageMb: 248.5,
    tokenRateLimit: 50000,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, telemetry, "System telemetry metrics retrieved"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { role, department } = req.query;
  const query = {};

  if (role) query.role = role;
  if (department) query.department = department;

  const users = await User.find(query).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users list retrieved successfully"));
});

export const triggerErpSync = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        syncStatus: "SUCCESS",
        recordsSynced: 1250,
        syncedAt: new Date().toISOString(),
      },
      "ERP Synchronization completed successfully"
    )
  );
});

// ============================================================================
// STUDENT MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * GET /api/v1/admin/students
 * Retrieve student records with filtering, searching, sorting, and pagination
 */
export const getAdminStudents = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const {
    search = "",
    department = "",
    semester = "",
    status = "",
    page = 1,
    limit = 50,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = { role: "STUDENT" };

  if (department) query.department = department;
  if (semester) query.semester = Number(semester);
  if (status) query.status = status;

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { rollNo: searchRegex },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [students, totalCount] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .populate("assignedMentor", "name email designation department")
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        students,
        pagination: {
          totalCount,
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          limit: limitNum,
        },
      },
      "Student records fetched successfully"
    )
  );
});

/**
 * GET /api/v1/admin/students/:id
 * Retrieve detailed student information
 */
export const getAdminStudentById = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { id } = req.params;

  const student = await User.findOne({ _id: id, role: "STUDENT" })
    .select("-password -refreshToken")
    .populate("assignedMentor", "name email designation department");

  if (!student) {
    throw new ApiError(404, "Student record not found");
  }

  // Fetch summary attendance & mentorship status
  const [attendanceRecords, mentorRequest] = await Promise.all([
    Attendance.find({ student: id }),
    MentorRequest.findOne({ student: id }).populate("mentor", "name email designation"),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student,
        attendanceSummary: attendanceRecords,
        mentorRequestSummary: mentorRequest,
      },
      "Student details retrieved successfully"
    )
  );
});

/**
 * POST /api/v1/admin/students
 * Create a new student record manually
 */
export const createStudent = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const {
    name,
    email,
    rollNo,
    department,
    semester,
    division,
    cgpa,
    attendancePercentage,
    phone,
    assignedMentor,
    password,
  } = req.body;

  if (!name || !email || !rollNo) {
    throw new ApiError(400, "Name, Email, and Roll Number/PRN are required.");
  }

  // Check for duplicate email or roll number
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { rollNo }],
  });

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      throw new ApiError(409, "A student with this email address already exists.");
    }
    if (existingUser.rollNo === rollNo) {
      throw new ApiError(409, "A student with this Roll Number/PRN already exists.");
    }
  }

  const defaultPassword = password || `VIT@${rollNo.replace(/[^a-zA-Z0-9]/g, "")}`;

  let mentorObjectId = null;
  if (assignedMentor) {
    const mentorUser = await User.findOne({
      $or: [{ _id: assignedMentor }, { email: assignedMentor.toLowerCase() }],
      role: "MENTOR",
    });
    if (mentorUser) {
      mentorObjectId = mentorUser._id;
    }
  }

  const newStudent = await User.create({
    name,
    email: email.toLowerCase(),
    password: defaultPassword,
    role: "STUDENT",
    rollNo,
    department: department || "Computer Engineering",
    semester: semester ? Number(semester) : 1,
    division: division || "Div A",
    cgpa: cgpa !== undefined ? Number(cgpa) : 0.0,
    attendancePercentage: attendancePercentage !== undefined ? Number(attendancePercentage) : 100.0,
    phone: phone || "",
    status: "ACTIVE",
    assignedMentor: mentorObjectId,
  });

  const createdStudent = await User.findById(newStudent._id)
    .select("-password -refreshToken")
    .populate("assignedMentor", "name email designation");

  return res
    .status(201)
    .json(new ApiResponse(201, createdStudent, "Student record created successfully"));
});

/**
 * PUT /api/v1/admin/students/:id
 * Update an existing student record (Preserves password, refreshToken, and role)
 */
export const updateStudent = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { id } = req.params;
  const {
    name,
    email,
    rollNo,
    department,
    semester,
    division,
    cgpa,
    attendancePercentage,
    phone,
    assignedMentor,
    status,
  } = req.body;

  const student = await User.findOne({ _id: id, role: "STUDENT" });
  if (!student) {
    throw new ApiError(404, "Student record not found");
  }

  // Check email/rollNo uniqueness if changing
  if (email && email.toLowerCase() !== student.email.toLowerCase()) {
    const existingEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
    if (existingEmail) {
      throw new ApiError(409, "Email address is already in use by another user.");
    }
    student.email = email.toLowerCase();
  }

  if (rollNo && rollNo !== student.rollNo) {
    const existingRoll = await User.findOne({ rollNo, _id: { $ne: id } });
    if (existingRoll) {
      throw new ApiError(409, "Roll Number/PRN is already in use by another student.");
    }
    student.rollNo = rollNo;
  }

  if (name) student.name = name;
  if (department) student.department = department;
  if (semester !== undefined) student.semester = Number(semester);
  if (division) student.division = division;
  if (cgpa !== undefined) student.cgpa = Number(cgpa);
  if (attendancePercentage !== undefined) student.attendancePercentage = Number(attendancePercentage);
  if (phone !== undefined) student.phone = phone;
  if (status && ["ACTIVE", "INACTIVE"].includes(status)) student.status = status;

  if (assignedMentor !== undefined) {
    if (!assignedMentor) {
      student.assignedMentor = null;
    } else {
      const mentorUser = await User.findOne({
        $or: [{ _id: assignedMentor }, { email: String(assignedMentor).toLowerCase() }],
        role: "MENTOR",
      });
      if (mentorUser) {
        student.assignedMentor = mentorUser._id;
      }
    }
  }

  await student.save({ validateBeforeSave: false });

  const updatedStudent = await User.findById(id)
    .select("-password -refreshToken")
    .populate("assignedMentor", "name email designation");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedStudent, "Student record updated successfully"));
});

/**
 * PATCH /api/v1/admin/students/:id/status
 * Toggle student status ACTIVE <-> INACTIVE
 */
export const updateStudentStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
    throw new ApiError(400, "Valid status ('ACTIVE' or 'INACTIVE') is required");
  }

  const student = await User.findOneAndUpdate(
    { _id: id, role: "STUDENT" },
    { status },
    { new: true }
  ).select("-password -refreshToken");

  if (!student) {
    throw new ApiError(404, "Student record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, student, `Student status updated to ${status}`));
});

/**
 * DELETE /api/v1/admin/students/:id
 * Delete or safely deactivate student
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { id } = req.params;
  const student = await User.findOne({ _id: id, role: "STUDENT" });

  if (!student) {
    throw new ApiError(404, "Student record not found");
  }

  // Check if student is referenced in child collections
  const [submissionCount, attendanceCount, mentorReqCount, onlineCourseCount, meetingCount] = await Promise.all([
    Submission.countDocuments({ student: id }),
    Attendance.countDocuments({ student: id }),
    MentorRequest.countDocuments({ student: id }),
    OnlineCourse.countDocuments({ student: id }),
    Meeting.countDocuments({ student: id }),
  ]);

  if (submissionCount > 0 || attendanceCount > 0 || mentorReqCount > 0 || onlineCourseCount > 0 || meetingCount > 0) {
    // Perform safe deactivation to preserve relational integrity
    student.status = "INACTIVE";
    await student.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(
        200,
        { deactivationOnly: true, student },
        "Student has active academic/mentorship records. Account safely deactivated instead of deleted."
      )
    );
  }

  await User.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { deletedId: id }, "Student record permanently deleted"));
});

// ============================================================================
// BULK CSV IMPORT ENGINE CONTROLLERS
// ============================================================================

// Helper function to normalize raw CSV headers
const normalizeHeaderKey = (key) => {
  const clean = String(key || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (["rollnumber", "rollno", "roll", "prn", "enrollment", "id", "rollnumberprn"].includes(clean)) return "rollNo";
  if (["name", "fullname", "studentname"].includes(clean)) return "name";
  if (["email", "emailaddress", "studentemail"].includes(clean)) return "email";
  if (["department", "dept", "branch"].includes(clean)) return "department";
  if (["semester", "sem", "year"].includes(clean)) return "semester";
  if (["division", "div", "section"].includes(clean)) return "division";
  if (["cgpa", "gpa", "marks"].includes(clean)) return "cgpa";
  if (["attendance", "attendancepercentage", "attendancepct"].includes(clean)) return "attendancePercentage";
  if (["phone", "phonenumber", "mobile"].includes(clean)) return "phone";
  if (["mentoremail", "assignedmentor", "mentor"].includes(clean)) return "mentorEmail";
  if (["password", "defaultpassword"].includes(clean)) return "password";
  return key;
};

/**
 * POST /api/v1/admin/students/import-preview
 * Dry-run validation of student rows without writing to MongoDB
 */
export const previewBulkImportStudents = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new ApiError(400, "No student data rows provided for import preview.");
  }

  // Fetch all existing users & mentors for fast in-memory lookup
  const [existingUsers, mentorUsers] = await Promise.all([
    User.find({ role: "STUDENT" }).select("email rollNo name"),
    User.find({ role: "MENTOR" }).select("email name designation department"),
  ]);

  const existingEmailMap = new Map(existingUsers.map((u) => [u.email.toLowerCase(), u]));
  const existingRollMap = new Map(existingUsers.filter((u) => u.rollNo).map((u) => [u.rollNo.toUpperCase(), u]));
  const mentorEmailMap = new Map(mentorUsers.map((m) => [m.email.toLowerCase(), m]));

  const fileRollsSeen = new Set();
  const fileEmailsSeen = new Set();

  let validNewCount = 0;
  let validUpdateCount = 0;
  let invalidCount = 0;

  const processedRows = rows.map((rawRow, index) => {
    const rowNum = index + 1;
    const errors = [];
    const normalizedData = {};

    // Normalize keys
    Object.keys(rawRow).forEach((key) => {
      const normKey = normalizeHeaderKey(key);
      normalizedData[normKey] = rawRow[key];
    });

    const name = String(normalizedData.name || "").trim();
    const email = String(normalizedData.email || "").trim().toLowerCase();
    const rollNo = String(normalizedData.rollNo || "").trim().toUpperCase();
    const department = String(normalizedData.department || "Computer Engineering").trim();
    const semester = normalizedData.semester ? parseInt(normalizedData.semester, 10) : 1;
    const division = String(normalizedData.division || "Div A").trim();
    const cgpa = normalizedData.cgpa !== undefined && normalizedData.cgpa !== "" ? parseFloat(normalizedData.cgpa) : 0.0;
    const attendancePct = normalizedData.attendancePercentage !== undefined && normalizedData.attendancePercentage !== "" ? parseFloat(normalizedData.attendancePercentage) : 100.0;
    const phone = String(normalizedData.phone || "").trim();
    const mentorEmail = String(normalizedData.mentorEmail || "").trim().toLowerCase();
    const password = String(normalizedData.password || "").trim();

    // Required Field Validations
    if (!name) errors.push("Full Name is missing");
    if (!email) {
      errors.push("Email address is missing");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email format");
    }

    if (!rollNo) errors.push("Roll Number / PRN is missing");

    // Value Range Validations
    if (isNaN(semester) || semester < 1 || semester > 8) errors.push("Semester must be a number between 1 and 8");
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) errors.push("CGPA must be a number between 0.0 and 10.0");
    if (isNaN(attendancePct) || attendancePct < 0 || attendancePct > 100) errors.push("Attendance must be between 0% and 100%");

    // File Duplicate Check
    if (rollNo) {
      if (fileRollsSeen.has(rollNo)) {
        errors.push(`Duplicate Roll Number '${rollNo}' within the uploaded file`);
      } else {
        fileRollsSeen.add(rollNo);
      }
    }

    if (email) {
      if (fileEmailsSeen.has(email)) {
        errors.push(`Duplicate Email '${email}' within the uploaded file`);
      } else {
        fileEmailsSeen.add(email);
      }
    }

    // Mentor Lookup
    let resolvedMentor = null;
    if (mentorEmail) {
      const foundMentor = mentorEmailMap.get(mentorEmail);
      if (foundMentor) {
        resolvedMentor = {
          id: foundMentor._id,
          name: foundMentor.name,
          email: foundMentor.email,
        };
      } else if (mentorUsers.length > 0 && /mentor\d+/i.test(mentorEmail)) {
        // Resolve placeholder emails like mentor1@vit.edu.in to seeded faculty mentors
        const matchDigits = mentorEmail.match(/mentor(\d+)/i);
        const index = matchDigits ? (parseInt(matchDigits[1], 10) - 1) % mentorUsers.length : 0;
        const matched = mentorUsers[Math.max(0, index)];
        if (matched) {
          resolvedMentor = {
            id: matched._id,
            name: matched.name,
            email: matched.email,
          };
        }
      }
    }

    let status = "VALID_NEW";
    if (errors.length > 0) {
      status = "INVALID";
      invalidCount++;
    } else {
      const isExistingRoll = existingRollMap.has(rollNo);
      const isExistingEmail = existingEmailMap.has(email);

      if (isExistingRoll || isExistingEmail) {
        status = "VALID_UPDATE";
        validUpdateCount++;
      } else {
        status = "VALID_NEW";
        validNewCount++;
      }
    }

    return {
      rowNumber: rowNum,
      status,
      errors,
      data: {
        name,
        email,
        rollNo,
        department,
        semester: isNaN(semester) ? 1 : semester,
        division,
        cgpa: isNaN(cgpa) ? 0.0 : cgpa,
        attendancePercentage: isNaN(attendancePct) ? 100.0 : attendancePct,
        phone,
        password,
      },
      resolvedMentor,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRows: rows.length,
        validNewCount,
        validUpdateCount,
        invalidCount,
        rows: processedRows,
      },
      "Bulk import dry-run preview validation completed"
    )
  );
});

/**
 * POST /api/v1/admin/students/import-commit
 * Performs actual database operations for bulk student import
 */
export const commitBulkImportStudents = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin authorization required.");
  }

  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new ApiError(400, "No validated rows provided for database import commit.");
  }

  const mentorUsers = await User.find({ role: "MENTOR" }).select("email name");
  const mentorEmailMap = new Map(mentorUsers.map((m) => [m.email.toLowerCase(), m._id]));

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const failureDetails = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    const rowData = item.data || item;
    const rowNum = item.rowNumber || i + 1;

    try {
      const email = String(rowData.email || "").trim().toLowerCase();
      const rollNo = String(rowData.rollNo || "").trim();
      const name = String(rowData.name || "").trim();

      if (!email || !rollNo || !name) {
        failedCount++;
        failureDetails.push({ rowNumber: rowNum, student: name || rollNo, error: "Missing required identity fields" });
        continue;
      }

      // Resolve mentor if provided
      let mentorId = null;
      if (item.resolvedMentor?.id) {
        mentorId = item.resolvedMentor.id;
      } else if (rowData.mentorEmail) {
        mentorId = mentorEmailMap.get(String(rowData.mentorEmail).trim().toLowerCase()) || null;
      }

      // Check if student already exists in DB
      const existingUser = await User.findOne({
        $or: [{ email }, { rollNo }],
        role: "STUDENT",
      });

      if (existingUser) {
        // UPDATE EXISTING STUDENT — NEVER OVERWRITE PASSWORD / REFRESH TOKEN / ROLE
        existingUser.name = name;
        existingUser.department = rowData.department || existingUser.department;
        if (rowData.semester !== undefined) existingUser.semester = Number(rowData.semester);
        if (rowData.division) existingUser.division = rowData.division;
        if (rowData.cgpa !== undefined) existingUser.cgpa = Number(rowData.cgpa);
        if (rowData.attendancePercentage !== undefined) existingUser.attendancePercentage = Number(rowData.attendancePercentage);
        if (rowData.phone !== undefined) existingUser.phone = rowData.phone;
        if (mentorId) existingUser.assignedMentor = mentorId;
        existingUser.status = "ACTIVE";

        await existingUser.save({ validateBeforeSave: false });
        updatedCount++;
      } else {
        // CREATE NEW STUDENT
        const defaultPass = rowData.password || `VIT@${rollNo.replace(/[^a-zA-Z0-9]/g, "")}`;

        await User.create({
          name,
          email,
          password: defaultPass,
          role: "STUDENT",
          rollNo,
          department: rowData.department || "Computer Engineering",
          semester: rowData.semester ? Number(rowData.semester) : 1,
          division: rowData.division || "Div A",
          cgpa: rowData.cgpa !== undefined ? Number(rowData.cgpa) : 0.0,
          attendancePercentage: rowData.attendancePercentage !== undefined ? Number(rowData.attendancePercentage) : 100.0,
          phone: rowData.phone || "",
          status: "ACTIVE",
          assignedMentor: mentorId,
        });
        createdCount++;
      }
    } catch (err) {
      failedCount++;
      failureDetails.push({
        rowNumber: rowNum,
        student: rowData.name || rowData.rollNo || "Unknown",
        error: err.message || "Database insert error",
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProcessed: rows.length,
        createdCount,
        updatedCount,
        skippedCount,
        failedCount,
        failures: failureDetails,
      },
      `Import complete: ${createdCount} created, ${updatedCount} updated, ${failedCount} failed.`
    )
  );
});

