const User = require("../models/User");
import path from "path";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { Request, Response } from "express";
const { BadRequestError, UnauthenticatedError } = require("../errors");
interface AuthRequest extends Request {
  user?: any;
}
const {
  sendVerificationEmail,
  createTokenUser,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError("Email already exists");
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  const origin = "http://127.0.0.1:5173/";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "You should receive an email for verification" });
};
const verifyEmail = async (req: AuthRequest, res: Response) => {
  const { verificationToken, email } = req.body;
  // console.log(req.body);
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Email not found");
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verfication failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};
const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide all details");
    }
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user) {
      throw new UnauthenticatedError("Wrong email/password");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Wrong email/password");
    }
    const tokenUser = createTokenUser(user);
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: tokenUser, token: token });
  } catch (error: any) {
    console.log(error);
  }
};
const logout = async (req: AuthRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
const forgotPassword = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide valid email");
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "http://127.0.0.1:5173/";
    // console.log(user);
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const twentyMinutes = 1000 * 60 * 20;
    const passwordTokenExpirationDate = new Date(Date.now() + twentyMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check you email for reset password link" });
};
const resetPassword = async (req: AuthRequest, res: Response) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "Password has been reset" });
};
module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
