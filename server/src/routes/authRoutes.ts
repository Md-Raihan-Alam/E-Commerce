import express from "express";

const router = express.Router();
const { authneticateUser } = require("../middleware/authentication");
const {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
module.exports = router;
