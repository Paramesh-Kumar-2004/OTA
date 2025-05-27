import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUsers,
  updateUser,
  resetPassword,
  updatePassword,
  deleteUser,
} from "../Controller/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//Secure Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getUsers").get(verifyJWT,getUsers);
router.route("/updateUser").put(updateUser);
router.route("/reset").post(resetPassword);
router.route("/updatePassword").post(updatePassword);
router.route("/deleteuser").delete(deleteUser);

export default router;

 