import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Goal } from "../models/goal.models.js";
import { generateGoalRoadmap } from "../services/aiService.js";

// GET /api/v1/student/goals
export const getStudentGoals = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const goals = await Goal.find({ student: studentId }).sort({
    isPrimary: -1,
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, goals, "Student goals retrieved successfully"));
});

// POST /api/v1/student/goals
export const createStudentGoal = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Goal title is required");
  }

  // Prevent exact duplicate ACTIVE goal titles for the same student
  const existingGoal = await Goal.findOne({
    student: studentId,
    title: title.trim(),
    status: "ACTIVE",
  });

  if (existingGoal) {
    throw new ApiError(400, "An active goal with this title already exists.");
  }

  // Check if this is the student's first goal
  const goalCount = await Goal.countDocuments({ student: studentId, status: "ACTIVE" });
  const isFirstGoal = goalCount === 0;

  const newGoal = await Goal.create({
    student: studentId,
    title: title.trim(),
    description: description ? description.trim() : "",
    isPrimary: isFirstGoal,
    roadmapGenerationStatus: "pending"
  });

  try {
    const studentContext = {
      name: req.user.fullName || req.user.name || "Student",
      role: req.user.role || "STUDENT",
      department: req.user.department || "Computer Engineering",
    };

    const generatedRoadmap = await generateGoalRoadmap({
      title: title.trim(),
      description: description ? description.trim() : "",
      studentContext
    });

    newGoal.roadmap = generatedRoadmap;
    newGoal.roadmapGenerationStatus = "completed";
    await newGoal.save();
  } catch (err) {
    console.error("Failed to generate roadmap:", err);
    newGoal.roadmap = [];
    newGoal.roadmapGenerationStatus = "failed";
    await newGoal.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newGoal, "Goal created successfully"));
});

// GET /api/v1/student/goals/:goalId
export const getStudentGoalById = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { goalId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new ApiError(400, "Invalid goal ID format");
  }

  const goal = await Goal.findOne({ _id: goalId, student: studentId });

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, goal, "Goal retrieved successfully"));
});

// PATCH /api/v1/student/goals/:goalId
export const updateStudentGoal = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { goalId } = req.params;
  const { title, description, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new ApiError(400, "Invalid goal ID format");
  }

  const goal = await Goal.findOne({ _id: goalId, student: studentId });

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  if (title) {
    const trimmedTitle = title.trim();
    if (trimmedTitle !== goal.title) {
      const duplicate = await Goal.findOne({
        student: studentId,
        title: trimmedTitle,
        status: "ACTIVE",
      });
      if (duplicate) {
        throw new ApiError(400, "An active goal with this title already exists.");
      }
      goal.title = trimmedTitle;
    }
  }

  if (description !== undefined) goal.description = description.trim();
  if (status) goal.status = status;

  await goal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, goal, "Goal updated successfully"));
});

// PATCH /api/v1/student/goals/:goalId/primary
export const setPrimaryGoal = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { goalId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new ApiError(400, "Invalid goal ID format");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const goal = await Goal.findOne({ _id: goalId, student: studentId }).session(session);

    if (!goal) {
      throw new ApiError(404, "Goal not found");
    }

    if (goal.status !== "ACTIVE") {
      throw new ApiError(400, "Only active goals can be set as primary");
    }

    // Set all other goals for this student to non-primary
    await Goal.updateMany(
      { student: studentId, _id: { $ne: goalId } },
      { $set: { isPrimary: false } },
      { session }
    );

    // Set selected goal to primary
    goal.isPrimary = true;
    await goal.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, goal, "Primary goal set successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// DELETE /api/v1/student/goals/:goalId
export const deleteStudentGoal = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { goalId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new ApiError(400, "Invalid goal ID format");
  }

  const goal = await Goal.findOne({ _id: goalId, student: studentId });

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  const wasPrimary = goal.isPrimary;

  // Archive it rather than hard delete, or hard delete if requested.
  // The user prompt said: "If a non-primary goal is deleted: delete/archive normally. If the PRIMARY goal is deleted or archived: do not leave the student's goal state inconsistent. DO NOT automatically make another goal primary."
  
  // Wait, let's just hard delete for simplicity since it's a student deleting their own goal. Or just mark it archived.
  goal.status = "ARCHIVED";
  goal.isPrimary = false; // It can't be primary if archived.
  await goal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Goal archived successfully"));
});
