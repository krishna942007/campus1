import { Router } from "express";
import {
  getSystemTelemetry,
  getAllUsers,
  triggerErpSync,
  getAdminStudents,
  getAdminStudentById,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  previewBulkImportStudents,
  commitBulkImportStudents,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/telemetry").get(getSystemTelemetry);
router.route("/users").get(getAllUsers);
router.route("/erp-sync").post(triggerErpSync);

// Student Management Routes
router.route("/students").get(getAdminStudents).post(createStudent);
router.route("/students/import-preview").post(previewBulkImportStudents);
router.route("/students/import-commit").post(commitBulkImportStudents);
router.route("/students/:id").get(getAdminStudentById).put(updateStudent).delete(deleteStudent);
router.route("/students/:id/status").patch(updateStudentStatus);

export default router;

