import { Router } from "express";
import { changeUserPassword, loginUser, logoutUser, registerUser, deleteUser } from "../controllers/auth.controller.js";
import { varifyJWT } from "../utils/auth.utils.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/changePassword", varifyJWT, changeUserPassword);
router.get("/deleteUser", varifyJWT, deleteUser);

export default router;