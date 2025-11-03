import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
const router = express.Router();
router
  .route("/api/users")
  .get(userCtrl.list)
  .post(userCtrl.create)
  .delete(async (req, res) => {
    try {
      const result = await (await import("../models/user.model.js")).default.deleteMany({});
      return res.json({ message: "All users removed", deletedCount: result.deletedCount });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "Failed to remove users" });
    }
  });
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);
export default router;
