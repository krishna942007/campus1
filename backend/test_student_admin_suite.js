import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import mongoose from "mongoose";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

// Set DNS for SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {}

// Force NODE_ENV to production for strict security test assertions
process.env.NODE_ENV = "production";

// Dynamically import app and models
const { app } = await import("./src/app.js");
const { User } = await import("./src/models/user.models.js");
const { Attendance } = await import("./src/models/attendance.models.js");
const { MentorRequest } = await import("./src/models/mentorRequest.models.js");
const { Submission } = await import("./src/models/submission.models.js");
const { Assignment } = await import("./src/models/assignment.models.js");
const { OnlineCourse } = await import("./src/models/onlineCourse.models.js");
const { Meeting } = await import("./src/models/meeting.models.js");

const TEST_PORT = 5999;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

// Test Results Collector
const testResults = [];

function recordTest(name, passed, details = "") {
  testResults.push({ name, passed, details });
  const symbol = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${symbol} | ${name}${details ? ` - ${details}` : ""}`);
}

// Helper HTTP Client with Cookie / Auth Token Support
async function requestApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const fetchOptions = {
    method: options.method || "GET",
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("🚀 VITARA ADMIN STUDENT DATA MANAGEMENT AUTOMATED TEST SUITE");
  console.log("=======================================================\n");

  // 1. Connect DB & Start Local Test HTTP Server
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "vitara";
  await mongoose.connect(uri, { dbName });
  await User.syncIndexes(); // Ensure MongoDB builds unique sparse index for rollNo
  console.log("⚙️ Test DB & indexes synchronized successfully.");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`⚙️ Temporary test server running on port ${TEST_PORT}.\n`);

  try {
    // Cleanup any leftover test data prior to execution
    await cleanupTestData();

    // 2. Setup Test Accounts (Admin, Mentor, Student)
    const testAdminPass = "TestAdminPass123!";
    const testMentorPass = "TestMentorPass123!";
    const testStudentPass = "TestStudentPass123!";

    const adminUser = await User.create({
      name: "TEST ADMIN",
      email: "test.admin@vit.edu.in",
      password: testAdminPass,
      role: "ADMIN",
      department: "Computer Engineering",
    });

    const mentorUser = await User.create({
      name: "TEST MENTOR",
      email: "test.mentor@vit.edu.in",
      password: testMentorPass,
      role: "MENTOR",
      department: "Computer Engineering",
      designation: "Associate Professor",
    });

    const studentUser = await User.create({
      name: "TEST EXISTING STUDENT",
      email: "test.student@vit.edu.in",
      password: testStudentPass,
      role: "STUDENT",
      department: "Computer Engineering",
      rollNo: "TEST_EX_001",
    });

    // Login Admin to get Token
    const adminLoginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: adminUser.email, password: testAdminPass },
    });
    const adminToken = adminLoginRes.data?.data?.accessToken;

    // Login Mentor to get Token
    const mentorLoginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: mentorUser.email, password: testMentorPass },
    });
    const mentorToken = mentorLoginRes.data?.data?.accessToken;

    // Login Student to get Token
    const studentLoginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: studentUser.email, password: testStudentPass },
    });
    const studentToken = studentLoginRes.data?.data?.accessToken;

    // =========================================================================
    // TEST 1: STUDENT CREATION
    // =========================================================================
    const createRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: {
        name: "TEST STUDENT 001",
        email: "test.student001@vit.edu.in",
        rollNo: "TEST_STU_001",
        department: "Computer Engineering",
        semester: 3,
        division: "Div A",
        cgpa: 8.75,
        attendancePercentage: 92.5,
        phone: "9876500001",
      },
    });

    const createdStudent = createRes.data?.data;
    const defaultGenPassword = "VIT@TESTSTU001"; // Default generated: rollNo stripped of non-alphanumerics

    const test1Pass =
      createRes.status === 201 &&
      createdStudent?.role === "STUDENT" &&
      createdStudent?.name === "TEST STUDENT 001" &&
      createdStudent?.password === undefined &&
      createdStudent?.refreshToken === undefined;

    recordTest("1. Student Creation (POST /api/v1/admin/students)", test1Pass, `Status: ${createRes.status}`);

    // =========================================================================
    // TEST 2: DUPLICATE PROTECTION
    // =========================================================================
    const dupEmailRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: {
        name: "DUP EMAIL STUDENT",
        email: "test.student001@vit.edu.in",
        rollNo: "TEST_STU_002",
      },
    });

    const dupRollRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: {
        name: "DUP ROLL STUDENT",
        email: "test.student002@vit.edu.in",
        rollNo: "TEST_STU_001",
      },
    });

    const test2Pass = dupEmailRes.status === 409 && dupRollRes.status === 409;
    recordTest("2. Duplicate Protection (Email & Roll Number)", test2Pass, `Email Dup: ${dupEmailRes.status}, Roll Dup: ${dupRollRes.status}`);

    // =========================================================================
    // TEST 3: STUDENT LISTING, FILTERS, SEARCH & PAGINATION
    // =========================================================================
    const listRes = await requestApi("/admin/students?search=TEST_STU_001&department=Computer Engineering&semester=3&status=ACTIVE&page=1&limit=10", {
      token: adminToken,
    });

    const listData = listRes.data?.data;
    const allAreStudents = listData?.students?.every((s) => s.role === "STUDENT" && s.password === undefined && s.refreshToken === undefined);
    const test3Pass =
      listRes.status === 200 &&
      allAreStudents &&
      listData?.students?.length >= 1 &&
      listData?.pagination?.totalCount >= 1;

    recordTest("3. Student Listing, Filters, Search & Pagination", test3Pass, `Found: ${listData?.students?.length || 0} students`);

    // =========================================================================
    // TEST 4: STUDENT DETAILS
    // =========================================================================
    const detailRes = await requestApi(`/admin/students/${createdStudent?._id}`, {
      token: adminToken,
    });

    const fetchedStudent = detailRes.data?.data?.student;
    const test4Pass =
      detailRes.status === 200 &&
      fetchedStudent?._id === createdStudent?._id &&
      fetchedStudent?.password === undefined;

    recordTest("4. Student Details (GET /api/v1/admin/students/:id)", test4Pass, `Status: ${detailRes.status}`);

    // =========================================================================
    // TEST 5 & 6: STUDENT UPDATE, MALICIOUS INPUT & PASSWORD PRESERVATION
    // =========================================================================
    const updateRes = await requestApi(`/admin/students/${createdStudent?._id}`, {
      method: "PUT",
      token: adminToken,
      body: {
        name: "TEST STUDENT 001 UPDATED",
        cgpa: 9.10,
        division: "Div B",
        // Malicious Payload Attempt
        role: "ADMIN",
        password: "HACKED_PASSWORD_123",
        refreshToken: "HACKED_REFRESH_TOKEN",
      },
    });

    const updatedStudentObj = updateRes.data?.data;
    const dbStudentAfterUpdate = await User.findById(createdStudent?._id);

    // Verify original password works (VIT@TESTSTU001)
    const loginWithOriginalPassRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: "test.student001@vit.edu.in", password: defaultGenPassword },
    });

    const test56Pass =
      updateRes.status === 200 &&
      updatedStudentObj?.name === "TEST STUDENT 001 UPDATED" &&
      dbStudentAfterUpdate?.role === "STUDENT" &&
      loginWithOriginalPassRes.status === 200;

    recordTest("5 & 6. Student Update, Malicious Input Safeguard & Password Preservation", test56Pass, `Role: ${dbStudentAfterUpdate?.role}, Pass Preserved: ${loginWithOriginalPassRes.status === 200}`);

    // =========================================================================
    // TEST 7: STATUS TOGGLE & INACTIVE STUDENT LOGIN REJECTION
    // =========================================================================
    // Deactivate student
    const deactivateRes = await requestApi(`/admin/students/${createdStudent?._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "INACTIVE" },
    });

    // Attempt login as inactive student
    const inactiveLoginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: "test.student001@vit.edu.in", password: defaultGenPassword },
    });

    // Reactivate student
    const reactivateRes = await requestApi(`/admin/students/${createdStudent?._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "ACTIVE" },
    });

    // Attempt login as active student
    const activeLoginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: "test.student001@vit.edu.in", password: defaultGenPassword },
    });

    const test7Pass =
      deactivateRes.status === 200 &&
      inactiveLoginRes.status === 403 &&
      reactivateRes.status === 200 &&
      activeLoginRes.status === 200;

    recordTest("7. Status Toggle & Inactive Account Login Rejection", test7Pass, `Inactive Login HTTP: ${inactiveLoginRes.status} (Expected 403)`);

    // =========================================================================
    // TEST 8 & 9: CSV DRY-RUN PREVIEW & HEADER NORMALIZATION
    // =========================================================================
    const sampleCsvRows = [
      { "Roll Number / PRN": "TEST_CSV_101", "Full Name": "CSV NEW STUDENT 1", "Email Address": "csv.new1@vit.edu.in", "Department": "Computer Engineering", "Semester": "5", "CGPA": "8.5", "Attendance %": "90", "Mentor Email": "test.mentor@vit.edu.in" },
      { "rollNo": "TEST_EX_001", "name": "TEST EXISTING UPDATE", "email": "test.student@vit.edu.in", "department": "Computer Engineering", "semester": "5" },
      { "PRN": "TEST_CSV_102", "name": "", "email": "invalid-email-format", "department": "Computer Engineering" }, // Invalid row
    ];

    const previewRes = await requestApi("/admin/students/import-preview", {
      method: "POST",
      token: adminToken,
      body: { rows: sampleCsvRows },
    });

    const previewData = previewRes.data?.data;
    const mongoCountCheck = await User.countDocuments({ rollNo: "TEST_CSV_101" });

    const test89Pass =
      previewRes.status === 200 &&
      previewData?.validNewCount === 1 &&
      previewData?.validUpdateCount === 1 &&
      previewData?.invalidCount === 1 &&
      mongoCountCheck === 0; // Ensures preview did NOT modify DB

    recordTest("8 & 9. CSV Dry-Run Preview & Header Normalization (Zero DB Mutations)", test89Pass, `Preview Counts: New=${previewData?.validNewCount}, Update=${previewData?.validUpdateCount}, Invalid=${previewData?.invalidCount}, DB Created=${mongoCountCheck}`);

    // =========================================================================
    // TEST 10 & 11: CSV COMMIT & UPDATE SAFETY
    // =========================================================================
    const preUpdateUser = await User.findOne({ rollNo: "TEST_EX_001" });
    const prePassHash = preUpdateUser.password;
    const preCreatedAt = preUpdateUser.createdAt.toISOString();

    const commitRes = await requestApi("/admin/students/import-commit", {
      method: "POST",
      token: adminToken,
      body: { rows: previewData.rows },
    });

    const commitData = commitRes.data?.data;
    const postUpdateUser = await User.findOne({ rollNo: "TEST_EX_001" });

    const test1011Pass =
      commitRes.status === 200 &&
      commitData?.createdCount === 1 &&
      commitData?.updatedCount === 1 &&
      postUpdateUser?.password === prePassHash &&
      postUpdateUser?.createdAt.toISOString() === preCreatedAt &&
      postUpdateUser?.role === "STUDENT";

    recordTest("10 & 11. CSV Commit & Existing Student Update Safety", test1011Pass, `Created: ${commitData?.createdCount}, Updated: ${commitData?.updatedCount}, Pass Preserved: ${postUpdateUser?.password === prePassHash}`);

    // =========================================================================
    // TEST 12: MENTOR VALIDATION
    // =========================================================================
    const validMentorAssignRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: {
        name: "TEST MENTOR LINK STUDENT",
        email: "test.mentorlink@vit.edu.in",
        rollNo: "TEST_ML_001",
        assignedMentor: mentorUser._id.toString(),
      },
    });

    const invalidMentorAssignRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: {
        name: "TEST INVALID MENTOR LINK",
        email: "test.invalidml@vit.edu.in",
        rollNo: "TEST_ML_002",
        assignedMentor: studentUser._id.toString(), // Student assigned as mentor
      },
    });

    const test12Pass =
      validMentorAssignRes.data?.data?.assignedMentor?.name === "TEST MENTOR" &&
      invalidMentorAssignRes.data?.data?.assignedMentor === null;

    recordTest("12. Faculty Mentor Assignment Validation", test12Pass, `Valid Assigned: ${validMentorAssignRes.data?.data?.assignedMentor?.name}, Invalid Student Assigned: ${invalidMentorAssignRes.data?.data?.assignedMentor}`);

    // =========================================================================
    // TEST 13: SAFE DELETE / DEACTIVATION REFERENCE CHECK
    // =========================================================================
    // Create clean student to test hard delete
    const cleanStudentRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: { name: "CLEAN DELETE STUDENT", email: "clean.delete@vit.edu.in", rollNo: "TEST_CLEAN_01" },
    });
    const cleanStudentId = cleanStudentRes.data?.data?._id;

    const hardDeleteRes = await requestApi(`/admin/students/${cleanStudentId}`, {
      method: "DELETE",
      token: adminToken,
    });

    // Create student with child records to test safe deactivation
    const refStudentRes = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: { name: "REF DEACTIVATED STUDENT", email: "ref.delete@vit.edu.in", rollNo: "TEST_REF_01" },
    });
    const refStudentId = refStudentRes.data?.data?._id;

    // Attach child attendance record
    await Attendance.create({
      student: refStudentId,
      subjectCode: "CS501",
      subjectName: "Data Structures",
      totalLectures: 30,
      attendedLectures: 25,
    });

    const safeDeactivateRes = await requestApi(`/admin/students/${refStudentId}`, {
      method: "DELETE",
      token: adminToken,
    });

    const refStudentInDb = await User.findById(refStudentId);

    const test13Pass =
      hardDeleteRes.status === 200 &&
      safeDeactivateRes.status === 200 &&
      safeDeactivateRes.data?.data?.deactivationOnly === true &&
      refStudentInDb?.status === "INACTIVE";

    recordTest("13. Safe Delete & Deactivation Reference Safeguard", test13Pass, `Clean Hard Delete: ${hardDeleteRes.status}, Ref Safe Deactivate: ${safeDeactivateRes.data?.data?.deactivationOnly}`);

    // =========================================================================
    // TEST 14: ROLE AUTHORIZATION CHECKS
    // =========================================================================
    const unauthRes = await requestApi("/admin/students");
    const studentAccessRes = await requestApi("/admin/students", { token: studentToken });
    const mentorAccessRes = await requestApi("/admin/students", { token: mentorToken });
    const adminAccessRes = await requestApi("/admin/students", { token: adminToken });

    const test14Pass =
      unauthRes.status === 401 &&
      studentAccessRes.status === 403 &&
      mentorAccessRes.status === 403 &&
      adminAccessRes.status === 200;

    recordTest("14. Role Authorization Safeguards (Admin Only)", test14Pass, `Unauth: ${unauthRes.status}, Student: ${studentAccessRes.status}, Mentor: ${mentorAccessRes.status}, Admin: ${adminAccessRes.status}`);

    // =========================================================================
    // TEST 15: DATA LEAK PROTECTION
    // =========================================================================
    const leakCheckResponses = [createRes, updateRes, detailRes, listRes];
    let passwordLeaked = false;
    let tokenLeaked = false;

    leakCheckResponses.forEach((r) => {
      const jsonStr = JSON.stringify(r.data || {});
      if (jsonStr.includes('"password":') && !jsonStr.includes('"password":undefined')) passwordLeaked = true;
      if (jsonStr.includes('"refreshToken":') && !jsonStr.includes('"refreshToken":undefined')) tokenLeaked = true;
    });

    const test15Pass = !passwordLeaked && !tokenLeaked;
    recordTest("15. Data Leak Safeguard (Password & Tokens Shielded)", test15Pass, `Pass Leaked: ${passwordLeaked}, Token Leaked: ${tokenLeaked}`);

    // =========================================================================
    // TEST 16: MONGODB DATABASE UNIQUENESS
    // =========================================================================
    let dbUniquePass = false;
    try {
      await User.create({ name: "DB DUP 1", email: "dbdup1@vit.edu.in", password: "Pass123!", rollNo: "DB_DUP_ROLL_99", role: "STUDENT" });
      await User.create({ name: "DB DUP 2", email: "dbdup2@vit.edu.in", password: "Pass123!", rollNo: "DB_DUP_ROLL_99", role: "STUDENT" });
    } catch (dbErr) {
      if (dbErr.code === 11000 || dbErr.message.includes("E11000") || dbErr.message.includes("duplicate key")) {
        dbUniquePass = true;
      }
    }
    recordTest("16. MongoDB Engine Unique Index Enforcement (rollNo)", dbUniquePass, `Duplicate Key Caught: ${dbUniquePass}`);

    // =========================================================================
    // TEST 17: ERROR HANDLING & MALFORMED INPUTS
    // =========================================================================
    const malformedIdRes = await requestApi("/admin/students/invalid-object-id-999", {
      token: adminToken,
    });

    const test17Pass = malformedIdRes.status === 400 || malformedIdRes.status === 500;
    recordTest("17. Error Handling & Malformed Input Safeguards", test17Pass, `Status: ${malformedIdRes.status}, Message: ${malformedIdRes.data?.message}`);

    // =========================================================================
    // TEST 18: FULL END-TO-END FLOW
    // =========================================================================
    // Execute seamless sequence
    const e2eRoll = "TEST_E2E_999";
    const e2eEmail = "test.e2e@vit.edu.in";
    const e2ePass = `VIT@TESTE2E999`;

    // 1. Create
    const e2eCreate = await requestApi("/admin/students", {
      method: "POST",
      token: adminToken,
      body: { name: "E2E STUDENT", email: e2eEmail, rollNo: e2eRoll },
    });
    const e2eId = e2eCreate.data?.data?._id;

    // 2. Fetch
    const e2eFetch = await requestApi(`/admin/students/${e2eId}`, { token: adminToken });

    // 3. Update
    const e2eUpdate = await requestApi(`/admin/students/${e2eId}`, {
      method: "PUT",
      token: adminToken,
      body: { name: "E2E STUDENT UPDATED", assignedMentor: mentorUser._id.toString() },
    });

    // 4. Deactivate & Verify Login Blocked
    await requestApi(`/admin/students/${e2eId}/status`, { method: "PATCH", token: adminToken, body: { status: "INACTIVE" } });
    const e2eLoginBlocked = await requestApi("/auth/login", { method: "POST", body: { email: e2eEmail, password: e2ePass } });

    // 5. Reactivate & Verify Login Works
    await requestApi(`/admin/students/${e2eId}/status`, { method: "PATCH", token: adminToken, body: { status: "ACTIVE" } });
    const e2eLoginSuccess = await requestApi("/auth/login", { method: "POST", body: { email: e2eEmail, password: e2ePass } });

    // 6. Delete
    const e2eDelete = await requestApi(`/admin/students/${e2eId}`, { method: "DELETE", token: adminToken });

    const test18Pass =
      e2eCreate.status === 201 &&
      e2eFetch.status === 200 &&
      e2eUpdate.status === 200 &&
      e2eLoginBlocked.status === 403 &&
      e2eLoginSuccess.status === 200 &&
      e2eDelete.status === 200;

    recordTest("18. Full End-to-End Execution Sequence", test18Pass, `Sequence Status: ${test18Pass ? "SUCCESS" : "FAILED"}`);

  } catch (err) {
    console.error("❌ Test Suite Crash Error:", err);
  } finally {
    // 3. Cleanup Test Data & Close Connections
    await cleanupTestData();
    await mongoose.disconnect();
    server.close();
    console.log("\n⚙️ Test DB & server shutdown completed.");

    // Print Final Execution Summary Table
    printSummaryReport();
  }
}

async function cleanupTestData() {
  try {
    const testPattern = /test.*@vit.edu.in|csv.*@vit.edu.in|clean.*@vit.edu.in|ref.*@vit.edu.in|dbdup.*@vit.edu.in|TEST_/i;
    const testUsers = await User.find({
      $or: [
        { email: testPattern },
        { rollNo: testPattern },
        { name: testPattern }
      ]
    }).select("_id");

    const testIds = testUsers.map((u) => u._id);

    if (testIds.length > 0) {
      await Promise.all([
        User.deleteMany({ _id: { $in: testIds } }),
        Attendance.deleteMany({ student: { $in: testIds } }),
        MentorRequest.deleteMany({ $or: [{ student: { $in: testIds } }, { mentor: { $in: testIds } }] }),
        Submission.deleteMany({ student: { $in: testIds } }),
        OnlineCourse.deleteMany({ $or: [{ student: { $in: testIds } }, { mentor: { $in: testIds } }] }),
        Meeting.deleteMany({ $or: [{ student: { $in: testIds } }, { mentor: { $in: testIds } }] }),
      ]);
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
}

function printSummaryReport() {
  console.log("\n=======================================================");
  console.log("📊 FINAL AUTOMATED TEST SUITE SUMMARY REPORT");
  console.log("=======================================================\n");

  const passedCount = testResults.filter((r) => r.passed).length;
  const failedCount = testResults.filter((r) => !r.passed).length;

  testResults.forEach((r) => {
    const statusStr = r.passed ? "PASS" : "FAIL";
    console.log(`${r.name.padEnd(65, ".")} ${statusStr}`);
  });

  console.log("\n-------------------------------------------------------");
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log("-------------------------------------------------------\n");
}

runTestSuite();
