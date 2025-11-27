import express from "express";
import { Register,loginUser,UserRole,logOut } from "../controllers/userController.js"
import { protect } from "../middleware/authmiddileware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", loginUser);
router.get("/userRole", protect, UserRole);
router.post("/logOut",protect, logOut);

export default router;
