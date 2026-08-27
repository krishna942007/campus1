import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { MentorRequest } from "../models/mentorRequest.models.js";
import { OnlineCourse } from "../models/onlineCourse.models.js";
import { Meeting } from "../models/meeting.models.js";
import { User } from "../models/user.models.js";

export const createMentorRequest = asyncHandler(async (req, res) => {
  const { mentorId, matchScore, matchReason, goals } = req.body;

  if (!mentorId) {
    throw new ApiError(400, "Mentor ID is required");
  }

  // Fetch full student document to check assigned mentor status
  const studentUser = await User.findById(req.user._id);
  if (!studentUser) {
    throw new ApiError(404, "Student user not found");
  }

  // Verify target mentor exists and is a mentor
  const targetMentor = await User.findById(mentorId);
  if (!targetMentor || targetMentor.role !== "MENTOR") {
    throw new ApiError(404, "Target mentor user not found");
  }

  // Prevent student from requesting their current assigned mentor
  if (
    studentUser.assignedMentor &&
    studentUser.assignedMentor.toString() === mentorId.toString()
  ) {
    throw new ApiError(400, "Cannot request your currently assigned mentor");
  }

  // Check if student already has an active pending request (PENDING or CHANGE_PENDING)
  const existingActiveRequest = await MentorRequest.findOne({
    student: req.user._id,
    status: { $in: ["PENDING", "CHANGE_PENDING"] },
  });

  if (existingActiveRequest) {
    throw new ApiError(400, "An active mentor request is already in progress");
  }

  // Determine status and previous mentor based on whether student already has an assigned mentor
  const isChangeRequest = Boolean(studentUser.assignedMentor);
  const requestStatus = isChangeRequest ? "CHANGE_PENDING" : "PENDING";
  const previousMentorId = isChangeRequest ? studentUser.assignedMentor : null;

  // Create MentorRequest document (Crucially: DO NOT update studentUser.assignedMentor here)
  const request = await MentorRequest.create({
    student: req.user._id,
    mentor: mentorId,
    previousMentor: previousMentorId,
    matchScore: matchScore || 92,
    matchReason: matchReason || "Goal alignment and domain interest overlap",
    goals: goals || "Academic and career guidance",
    status: requestStatus,
  });

  const populatedRequest = await MentorRequest.findById(request._id)
    .populate("student", "name email rollNo cgpa attendancePercentage department")
    .populate("mentor", "name email designation department domainExpertise")
    .populate("previousMentor", "name email designation department");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedRequest, isChangeRequest ? "Mentor change request sent successfully" : "Mentor request sent successfully"));
});

export const getMentorRequests = asyncHandler(async (req, res) => {
  const query = req.user.role === "MENTOR" ? { mentor: req.user._id } : { student: req.user._id };

  const requests = await MentorRequest.find(query)
    .populate("student", "name email rollNo cgpa attendancePercentage department")
    .populate("mentor", "name email designation department domainExpertise")
    .populate("previousMentor", "name email designation department");

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Mentor requests retrieved successfully"));
});

export const respondMentorRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status, feedbackNote } = req.body;

  if (!["ACCEPTED", "DECLINED"].includes(status)) {
    throw new ApiError(400, "Status must be ACCEPTED or DECLINED");
  }

  const request = await MentorRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Mentor request not found");
  }

  // Ensure request is in a pending state and has not been already processed
  if (!["PENDING", "CHANGE_PENDING"].includes(request.status)) {
    throw new ApiError(400, "Mentor request has already been processed");
  }

  // Authorization check: Only the targeted mentor (or ADMIN) can respond to the request
  if (request.mentor.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to respond to this mentor request");
  }

  // STALE REQUEST VALIDATION:
  // If request is a CHANGE_PENDING request and mentor is ACCEPTING it,
  // verify that the student's current assignedMentor is STILL the mentor stored in request.previousMentor.
  if (status === "ACCEPTED" && request.status === "CHANGE_PENDING") {
    const currentStudent = await User.findById(request.student);
    if (
      !currentStudent ||
      !currentStudent.assignedMentor ||
      currentStudent.assignedMentor.toString() !== request.previousMentor?.toString()
    ) {
      throw new ApiError(
        400,
        "Stale change request: The student's assigned mentor has changed since this request was submitted."
      );
    }
  }

  // Attempt atomic transaction with fallback for standalone environments
  let session = null;
  let useTransaction = false;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (sessErr) {
    // Fallback if standalone MongoDB without replica set
    session = null;
    useTransaction = false;
  }

  try {
    request.status = status;
    if (feedbackNote) request.feedbackNote = feedbackNote;

    if (status === "ACCEPTED") {
      if (useTransaction && session) {
        await User.findByIdAndUpdate(
          request.student,
          { assignedMentor: request.mentor },
          { session }
        );
        await request.save({ session });
        await session.commitTransaction();
      } else {
        await User.findByIdAndUpdate(request.student, {
          assignedMentor: request.mentor,
        });
        await request.save();
      }
    } else {
      if (useTransaction && session) {
        await request.save({ session });
        await session.commitTransaction();
      } else {
        await request.save();
      }
    }
  } catch (err) {
    if (useTransaction && session && session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    if (useTransaction && session) {
      session.endSession();
    }
  }

  const updatedRequest = await MentorRequest.findById(request._id)
    .populate("student", "name email rollNo cgpa attendancePercentage department")
    .populate("mentor", "name email designation department domainExpertise")
    .populate("previousMentor", "name email designation department");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRequest, `Mentor request ${status.toLowerCase()}`));
});

export const getAllMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: "MENTOR" }).select(
    "name email designation department domainExpertise avatar"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, mentors, "Faculty mentors retrieved successfully"));
});

export const assignOnlineCourse = asyncHandler(async (req, res) => {
  const { studentId, title, platform, url, category, difficulty, guidanceNotes } = req.body;

  if (req.user.role !== "MENTOR" && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only mentors and admins can assign courses to students");
  }

  if (!studentId || !title) {
    throw new ApiError(400, "Student ID and course title are required");
  }

  const course = await OnlineCourse.create({
    student: studentId,
    mentor: req.user._id,
    title,
    platform: platform || "Stanford Online",
    url: url || "",
    category: category || "Computer Science",
    difficulty: difficulty || "Intermediate",
    guidanceNotes: guidanceNotes || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course assigned to student successfully"));
});

export const getAssignedCourses = asyncHandler(async (req, res) => {
  const query = req.user.role === "STUDENT" ? { student: req.user._id } : { mentor: req.user._id };

  const courses = await OnlineCourse.find(query)
    .populate("student", "name email rollNo")
    .populate("mentor", "name email designation");

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Assigned courses retrieved successfully"));
});

export const scheduleMeeting = asyncHandler(async (req, res) => {
  const { studentId, title, agenda, scheduledAt, meetingLink } = req.body;

  if (req.user.role !== "MENTOR" && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only mentors and admins can schedule 1-on-1 meetings");
  }

  if (!studentId || !title || !scheduledAt) {
    throw new ApiError(400, "Student ID, title, and scheduled time are required");
  }

  const parsedDate = new Date(scheduledAt);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid scheduledAt date format");
  }

  const meeting = await Meeting.create({
    student: studentId,
    mentor: req.user._id,
    title,
    agenda: agenda || "1-on-1 Mentorship Session",
    scheduledAt: parsedDate,
    meetingLink: meetingLink || "https://meet.google.com/abc-defg-hij",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, meeting, "Meeting scheduled successfully"));
});

export const getMentorMentees = asyncHandler(async (req, res) => {
  const acceptedRequests = await MentorRequest.find({
    mentor: req.user._id,
    status: "ACCEPTED",
  }).populate("student", "name email rollNo cgpa attendancePercentage department avatar");

  const mentees = acceptedRequests.map((req) => req.student);

  return res
    .status(200)
    .json(new ApiResponse(200, mentees, "Mentees list fetched successfully"));
});
