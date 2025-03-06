import { Router } from "express";
import multipart from "connect-multiparty";
import staffController from "../controller/staff.controller.js";
import { updateAvatar, getAvatar } from "../service/avatarService.js";
import { authenticated } from "../middleware/auth.js";

const router = Router();
const multipartMiddleware = multipart({ uploadDir: "./upload/staff" });

router.get("/staff", (req, res) => {
  res.status(200).send("Staff");
});
router.get("/get-staff", authenticated, staffController.getStaff);
router.get("/get-staff-id/:id", authenticated, staffController.getStaffById);

// POST
router.post("/create-staff", multipartMiddleware, staffController.create);
router.post("/login-staff", staffController.login);

// PUT
router.put("/update-staff/:id", authenticated, staffController.updateStaff);
router.put("/delete-staff/:id", authenticated, staffController.deleteStaff);
export default router;
