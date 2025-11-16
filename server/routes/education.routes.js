import express from "express";
import educationCtrl from "../controllers/education.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Qualifications routes
router
  .route("/api/qualifications")
  .get(educationCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.isAdmin, educationCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, educationCtrl.removeAll);

// Single qualification routes
router
  .route("/api/qualifications/:educationId")
  .get(educationCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, educationCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, educationCtrl.remove);

router.param("educationId", educationCtrl.educationByID);

export default router;
