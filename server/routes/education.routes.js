import express from "express";
import educationCtrl from "../controllers/education.controller.js";

const router = express.Router();

// Qualifications routes
router
  .route("/api/qualifications")
  .get(educationCtrl.list)
  .post(educationCtrl.create)
  .delete(educationCtrl.removeAll);

// Single qualification routes
router
  .route("/api/qualifications/:educationId")
  .get(educationCtrl.read)
  .put(educationCtrl.update)
  .delete(educationCtrl.remove);

router.param("educationId", educationCtrl.educationByID);

export default router;
