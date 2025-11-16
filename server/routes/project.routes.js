import express from "express";
import projectCtrl from "../controllers/project.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Projects routes
router.route("/api/projects")
  .get(projectCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.removeAll);

// Single project routes
router
  .route("/api/projects/:projectId")
  .get(projectCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, projectCtrl.remove);

router.param("projectId", projectCtrl.projectByID);

export default router;
