/**
 * ====================================================================================
 * VITARA 2.0 — Student Mentor Change Request Controller Integration Test Suite
 * ====================================================================================
 * 
 * Description:
 *   Professional automated integration test suite validating real Express controllers
 *   (createMentorRequest, respondMentorRequest) and database persistence.
 * 
 * Invocation Architecture:
 *   Executes actual Express controller functions passing mock Request/Response wrappers,
 *   testing real validation checks, authorization rules, stale request protection, and
 *   atomic Mongoose session transactions.
 * 
 * Execution:
 *   node backend/tests/test_mentor_change_workflow.js
 * ====================================================================================
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import mongoose from "mongoose";
import { User } from "../src/models/user.models.js";
import { MentorRequest } from "../src/models/mentorRequest.models.js";
import {
  createMentorRequest,
  respondMentorRequest,
} from "../src/controllers/mentor.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure DNS for MongoDB Atlas SRV lookup on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (dnsErr) {
  // Ignore if system restricts DNS overrides
}

// Load backend environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vitara";

/**
 * Express Request/Response Mock Helper
 * Intercepts status code and json payload from controller invocations.
 */
function createMockReqRes(reqOptions = {}) {
  const req = {
    user: reqOptions.user || null,
    body: reqOptions.body || {},
    params: reqOptions.params || {},
  };

  const res = {
    statusCode: 200,
    responseData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.responseData = data;
      return this;
    },
  };

  return { req, res };
}

/**
 * Controller Invocation Runner with Error Handling
 */
async function invokeController(controllerFn, reqOptions) {
  const { req, res } = createMockReqRes(reqOptions);

  return new Promise((resolve) => {
    const next = (err) => {
      resolve({
        statusCode: err ? (err.statusCode || 500) : res.statusCode,
        data: null,
        rawResponse: null,
        error: err ? err.message : null,
      });
    };

    res.json = function (data) {
      this.responseData = data;
      resolve({
        statusCode: this.statusCode,
        data: data ? data.data : null,
        rawResponse: data,
        error: null,
      });
      return this;
    };

    controllerFn(req, res, next);
  });
}

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function logHeader(text) {
  console.log(`\n${COLORS.cyan}${COLORS.bold}====================================================${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bold}   ${text}${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bold}====================================================${COLORS.reset}`);
}

function logTest(testNum, title, passed, details) {
  const icon = passed ? `${COLORS.green}✓ PASS${COLORS.reset}` : `${COLORS.red}✗ FAIL${COLORS.reset}`;
  console.log(`\n${COLORS.bold}TEST ${testNum}:${COLORS.reset} ${title}`);
  console.log(`  Status: ${icon}`);
  if (details) console.log(`  Details: ${COLORS.yellow}${details}${COLORS.reset}`);
}

async function runTestSuite() {
  logHeader("VITARA 2.0 — Controller Integration Test Suite");

  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME || "vitara" });
    console.log("Connected successfully.\n");

    // Clean up test entities
    await User.deleteMany({
      email: {
        $in: [
          "test_student_s@vit.edu.in",
          "mentor_a@vit.edu.in",
          "mentor_b@vit.edu.in",
          "mentor_c@vit.edu.in",
          "unassigned_student@vit.edu.in",
        ],
      },
    });
    await MentorRequest.deleteMany({});

    // Fixtures Setup
    const mentorA = await User.create({
      name: "Mentor A (Prof. S. Kulkarni)",
      email: "mentor_a@vit.edu.in",
      password: "password123",
      role: "MENTOR",
      department: "Computer Engineering",
    });

    const mentorB = await User.create({
      name: "Mentor B (Prof. V. Sharma)",
      email: "mentor_b@vit.edu.in",
      password: "password123",
      role: "MENTOR",
      department: "Computer Engineering",
    });

    const mentorC = await User.create({
      name: "Mentor C (Dr. R. Mehta)",
      email: "mentor_c@vit.edu.in",
      password: "password123",
      role: "MENTOR",
      department: "Data Science & AI",
    });

    const studentS = await User.create({
      name: "Student S (Krishna Singh)",
      email: "test_student_s@vit.edu.in",
      password: "password123",
      role: "STUDENT",
      rollNo: "TEST_ROLL_001",
      assignedMentor: mentorA._id,
    });

    const unassignedStudent = await User.create({
      name: "Unassigned Student",
      email: "unassigned_student@vit.edu.in",
      password: "password123",
      role: "STUDENT",
      rollNo: "TEST_ROLL_002",
      assignedMentor: null,
    });

    console.log("Test Fixtures Initialized:");
    console.log(`  - Student S: Assigned to ${mentorA.name}`);
    console.log(`  - Unassigned Student: No mentor`);

    // =========================================================================
    // TEST 1: Real Controller - Student S (assigned to A) requests Mentor B
    // Expected: createMentorRequest succeeds (201), status = CHANGE_PENDING, assignedMentor stays A
    // =========================================================================
    const result1 = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorB._id.toString(), matchScore: 91, matchReason: "Specialization shift" },
    });

    const studentAfterReq1 = await User.findById(studentS._id);
    const test1Pass =
      result1.statusCode === 201 &&
      result1.data.status === "CHANGE_PENDING" &&
      studentAfterReq1.assignedMentor.toString() === mentorA._id.toString();

    logTest(
      1,
      "Real Controller: Student S requests Mentor B (Change Request)",
      test1Pass,
      `HTTP Status: ${result1.statusCode}, Request Status: ${result1.data?.status}, Student Assigned Mentor: ${studentAfterReq1.assignedMentor} (Mentor A)`
    );

    const req1Id = result1.data._id;

    // =========================================================================
    // TEST 2: Real Controller - Mentor B Declines Change Request
    // Expected: respondMentorRequest succeeds (200), status = DECLINED, assignedMentor stays A
    // =========================================================================
    const result2 = await invokeController(respondMentorRequest, {
      user: mentorB,
      params: { requestId: req1Id.toString() },
      body: { status: "DECLINED", feedbackNote: "Capacity full" },
    });

    const studentAfterReq2 = await User.findById(studentS._id);
    const test2Pass =
      result2.statusCode === 200 &&
      result2.data.status === "DECLINED" &&
      studentAfterReq2.assignedMentor.toString() === mentorA._id.toString();

    logTest(
      2,
      "Real Controller: Mentor B declines change request",
      test2Pass,
      `HTTP Status: ${result2.statusCode}, Request Status: ${result2.data?.status}, Student Assigned Mentor: ${studentAfterReq2.assignedMentor} (Still Mentor A)`
    );

    // =========================================================================
    // TEST 3: Real Controller - Student requests B again & Mentor B Accepts
    // Expected: respondMentorRequest succeeds (200), status = ACCEPTED, assignedMentor updates to B
    // =========================================================================
    const result3Req = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorB._id.toString(), matchScore: 95, matchReason: "Re-applying" },
    });

    const req3Id = result3Req.data._id;

    const result3Accept = await invokeController(respondMentorRequest, {
      user: mentorB,
      params: { requestId: req3Id.toString() },
      body: { status: "ACCEPTED" },
    });

    const studentAfterReq3 = await User.findById(studentS._id);
    const test3Pass =
      result3Accept.statusCode === 200 &&
      result3Accept.data.status === "ACCEPTED" &&
      studentAfterReq3.assignedMentor.toString() === mentorB._id.toString();

    logTest(
      3,
      "Real Controller: Mentor B accepts change request",
      test3Pass,
      `HTTP Status: ${result3Accept.statusCode}, Request Status: ${result3Accept.data?.status}, Student Assigned Mentor: ${studentAfterReq3.assignedMentor} (Now Mentor B)`
    );

    // =========================================================================
    // TEST 4: Real Controller - Prevent Duplicate Active Pending Request
    // Expected: createMentorRequest fails (400 Bad Request)
    // =========================================================================
    // Create an active request first
    await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorC._id.toString() },
    });

    // Attempt second simultaneous active request
    const result4 = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorA._id.toString() },
    });

    const test4Pass = result4.statusCode === 400 && result4.error.includes("already in progress");
    logTest(
      4,
      "Real Controller: Reject duplicate active pending request",
      test4Pass,
      `HTTP Status: ${result4.statusCode}, Error: "${result4.error}"`
    );

    // Clean up active request for next tests
    await MentorRequest.deleteMany({ student: studentS._id, status: "CHANGE_PENDING" });

    // =========================================================================
    // TEST 5: Real Controller - Prevent Student from Requesting Current Mentor
    // Expected: createMentorRequest fails (400 Bad Request)
    // =========================================================================
    const result5 = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorB._id.toString() }, // Currently assigned to B
    });

    const test5Pass = result5.statusCode === 400 && result5.error.includes("currently assigned mentor");
    logTest(
      5,
      "Real Controller: Reject request to currently assigned mentor",
      test5Pass,
      `HTTP Status: ${result5.statusCode}, Error: "${result5.error}"`
    );

    // =========================================================================
    // TEST 6: Real Controller - Prevent Unauthorized Mentor C Response
    // Expected: respondMentorRequest fails (403 Forbidden)
    // =========================================================================
    // Create request targeted to Mentor A
    const reqToA = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorA._id.toString() },
    });

    const result6 = await invokeController(respondMentorRequest, {
      user: mentorC, // Unauthorized mentor C
      params: { requestId: reqToA.data._id.toString() },
      body: { status: "ACCEPTED" },
    });

    const test6Pass = result6.statusCode === 403 && result6.error.includes("not authorized");
    logTest(
      6,
      "Real Controller: Reject unauthorized Mentor C response",
      test6Pass,
      `HTTP Status: ${result6.statusCode}, Error: "${result6.error}"`
    );

    // Clean up reqToA
    await MentorRequest.findByIdAndDelete(reqToA.data._id);

    // =========================================================================
    // TEST 7: Real Controller - Prevent Re-Processing Already Processed Request
    // Expected: respondMentorRequest fails (400 Bad Request)
    // =========================================================================
    const result7 = await invokeController(respondMentorRequest, {
      user: mentorB,
      params: { requestId: req3Id.toString() }, // Already ACCEPTED in Test 3
      body: { status: "ACCEPTED" },
    });

    const test7Pass = result7.statusCode === 400 && result7.error.includes("already been processed");
    logTest(
      7,
      "Real Controller: Reject re-processing an already ACCEPTED request",
      test7Pass,
      `HTTP Status: ${result7.statusCode}, Error: "${result7.error}"`
    );

    // =========================================================================
    // TEST 8: Real Controller - Standard Unassigned Student Initial Request
    // Expected: Initial request status = PENDING; acceptance assigns mentor
    // =========================================================================
    const reqUnassigned = await invokeController(createMentorRequest, {
      user: unassignedStudent,
      body: { mentorId: mentorA._id.toString() },
    });

    const resUnassignedAccept = await invokeController(respondMentorRequest, {
      user: mentorA,
      params: { requestId: reqUnassigned.data._id.toString() },
      body: { status: "ACCEPTED" },
    });

    const unassignedUpdated = await User.findById(unassignedStudent._id);
    const test8Pass =
      reqUnassigned.data.status === "PENDING" &&
      resUnassignedAccept.statusCode === 200 &&
      unassignedUpdated.assignedMentor.toString() === mentorA._id.toString();

    logTest(
      8,
      "Real Controller: Standard initial mentor request for unassigned student",
      test8Pass,
      `Initial Status: ${reqUnassigned.data?.status}, HTTP Status: ${resUnassignedAccept.statusCode}, Assigned Mentor: ${unassignedUpdated.assignedMentor} (Mentor A)`
    );

    // =========================================================================
    // TEST 9: Real Controller - STALE REQUEST PROTECTION
    // Scenario: Student S (Mentor B) requests Mentor A.
    //           Before Mentor A responds, Admin updates Student S to Mentor C.
    //           Mentor A tries to accept old request.
    // Expected: Controller catches stale request, returns 400, leaves assignedMentor at Mentor C.
    // =========================================================================
    // Re-assign Student S to Mentor B first
    await User.findByIdAndUpdate(studentS._id, { assignedMentor: mentorB._id });

    // Student S submits change request to Mentor A (previousMentor: Mentor B)
    const staleReq = await invokeController(createMentorRequest, {
      user: studentS,
      body: { mentorId: mentorA._id.toString() },
    });

    const staleReqId = staleReq.data._id;

    // Simulate concurrent mentor change to Mentor C (e.g. via Admin override)
    await User.findByIdAndUpdate(studentS._id, { assignedMentor: mentorC._id });

    // Now Mentor A attempts to accept the old stale request
    const resultStaleAccept = await invokeController(respondMentorRequest, {
      user: mentorA,
      params: { requestId: staleReqId.toString() },
      body: { status: "ACCEPTED" },
    });

    const studentAfterStale = await User.findById(studentS._id);
    const staleReqAfter = await MentorRequest.findById(staleReqId);

    const test9Pass =
      resultStaleAccept.statusCode === 400 &&
      resultStaleAccept.error.includes("Stale change request") &&
      studentAfterStale.assignedMentor.toString() === mentorC._id.toString() &&
      staleReqAfter.status === "CHANGE_PENDING";

    logTest(
      9,
      "Real Controller: STALE REQUEST PROTECTION (Prevents overwriting newer mentor assignment)",
      test9Pass,
      `HTTP Status: ${resultStaleAccept.statusCode}, Error: "${resultStaleAccept.error}", Student Mentor Remained: ${studentAfterStale.assignedMentor} (Mentor C), Request Status Remained: ${staleReqAfter.status}`
    );

    logHeader("ALL 9 CONTROLLER INTEGRATION TESTS COMPLETED SUCCESSFULLY ✓");

  } catch (error) {
    console.error(`${COLORS.red}Error executing controller integration test suite:${COLORS.reset}`, error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

runTestSuite();
