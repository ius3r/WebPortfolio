import express from "express";
import portfolioCtrl from "../controllers/portfolioinfo.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Public: get the single portfolio info
router.get("/api/portfolioinfo", portfolioCtrl.getSingle);

// Admin: upsert the single portfolio info
router.put("/api/portfolioinfo", authCtrl.requireSignin, authCtrl.isAdmin, portfolioCtrl.upsert);

// Admin: CRUD by id (optional)
router
  .route("/api/portfolioinfo/:id")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, portfolioCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, portfolioCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, portfolioCtrl.remove);

export default router;
