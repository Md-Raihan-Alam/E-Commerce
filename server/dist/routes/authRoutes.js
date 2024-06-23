"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { authneticateUser } = require("../middleware/authentication");
const { register, login, verifyEmail, logout, forgotPassword, resetPassword, } = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
module.exports = router;
