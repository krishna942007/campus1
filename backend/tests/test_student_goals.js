import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import http from "http";
import assert from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

process.env.NODE_ENV = "test";

const { app } = await import("../src/app.js");
const { User } = await import("../src/models/user.models.js");
const { Goal } = await import("../src/models/goal.models.js");

const TEST_PORT = 5998;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

const testResults = [];
function recordTest(name, passed, details = "") {
  testResults.push({ name, passed, details });
  const symbol = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${symbol} | ${name}${details ? ` - ${details}` : ""}`);
}

async function requestApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  
  const fetchOptions = { method: options.method || "GET", headers };
  if (options.body) fetchOptions.body = JSON.stringify(options.body);

  const response = await fetch(url, fetchOptions);
  let data = null;
  try { data = await response.json(); } catch (e) {}
  
  return { status: response.status, ok: response.ok, data };
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("🚀 STUDENT GOALS AUTOMATED TEST SUITE");
  console.log("=======================================================\n");

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "vitara";
  await mongoose.connect(uri, { dbName });
  await Goal.syncIndexes();
  await User.syncIndexes();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  try {
    // Cleanup first
    await User.deleteMany({ email: { $in: ["goal_student@vit.edu", "other@vit.edu"] } });
    await Goal.deleteMany({ title: { $in: ["Software Engineer", "Data Scientist"] } });

    // Setup Test User
    const studentUser1 = await User.create({
      name: "Test Goal Student",
      email: "goal_student@vit.edu",
      password: "password123",
      role: "STUDENT"
    });
    const loginRes = await requestApi("/auth/login", {
      method: "POST",
      body: { email: "goal_student@vit.edu", password: "password123" }
    });
    
    if (!loginRes.ok) {
        console.error("Login failed:", loginRes);
    }
    const studentToken = loginRes.data.data.accessToken;
    
    const studentUser2 = await User.create({
      name: "Other Student",
      email: "other@vit.edu",
      password: "password123",
      role: "STUDENT"
    });
    const login2 = await requestApi("/auth/login", { method: "POST", body: { email: "other@vit.edu", password: "password123" }});
    const studentToken2 = login2.data?.data?.accessToken;


    // 1. First goal becomes primary
    let res = await requestApi("/student/goals", {
      method: "POST",
      token: studentToken,
      body: { title: "Software Engineer" }
    });
    
    assert(res.ok && res.data.data.isPrimary === true);
    // AI might succeed if API key is present in environment, or fail if not
    assert(["completed", "failed"].includes(res.data.data.roadmapGenerationStatus));
    if (res.data.data.roadmapGenerationStatus === "failed") {
      assert(Array.isArray(res.data.data.roadmap) && res.data.data.roadmap.length === 0);
    } else {
      assert(Array.isArray(res.data.data.roadmap) && res.data.data.roadmap.length >= 3);
    }
    recordTest("First goal is automatically primary and handles AI correctly", true);

    const firstGoalId = res.data.data._id;

    // 2. Second goal is not primary
    res = await requestApi("/student/goals", {
      method: "POST",
      token: studentToken,
      body: { title: "Data Scientist" }
    });
    assert(res.ok && res.data.data.isPrimary === false);
    recordTest("Second goal is NOT primary by default", true);
    const secondGoalId = res.data.data._id;

    // 3. Switch primary goal
    res = await requestApi(`/student/goals/${secondGoalId}/primary`, {
      method: "PATCH",
      token: studentToken
    });
    assert(res.ok && res.data.data.isPrimary === true);
    
    res = await requestApi("/student/goals", { token: studentToken });
    const goals = res.data.data;
    const firstGoal = goals.find(g => g._id === firstGoalId);
    const secondGoal = goals.find(g => g._id === secondGoalId);
    assert(firstGoal.isPrimary === false && secondGoal.isPrimary === true);
    recordTest("Switching primary updates both goals correctly", true);

    // 4. Update goal
    res = await requestApi(`/student/goals/${firstGoalId}`, {
      method: "PATCH",
      token: studentToken,
      body: { description: "Build apps" }
    });
    assert(res.ok && res.data.data.description === "Build apps");
    recordTest("Student can update own goal", true);

    // 5. Auth / Isolation
    res = await requestApi(`/student/goals/${firstGoalId}`, { token: studentToken2 });
    assert(res.status === 404);
    recordTest("Student cannot read another student's goal", true);

    // 6. Delete (Archive)
    res = await requestApi(`/student/goals/${secondGoalId}`, { method: "DELETE", token: studentToken });
    assert(res.ok);
    res = await requestApi(`/student/goals/${secondGoalId}`, { token: studentToken });
    assert(res.data.data.status === "ARCHIVED" && res.data.data.isPrimary === false);
    recordTest("Archiving a primary goal drops its primary status safely", true);

  } catch (err) {
    console.error("Test failed", err);
  } finally {
    await mongoose.connection.close();
    server.close();
    console.log("Tests complete.");
  }
}

runTestSuite();
