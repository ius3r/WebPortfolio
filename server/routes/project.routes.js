import express from "express";
import projectCtrl from "../controllers/project.controller.js";

const router = express.Router();

// Projects routes
router.route("/api/projects")
  .get(projectCtrl.list)
  .post(projectCtrl.create)
  .delete(projectCtrl.removeAll);

// Single project routes
router
  .route("/api/projects/:projectId")
  .get(projectCtrl.read)
  .put(projectCtrl.update)
  .delete(projectCtrl.remove);

router.param("projectId", projectCtrl.projectByID);

export default router;
