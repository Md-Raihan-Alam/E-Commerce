const User = require("../models/User");
const Token = require("../models/Token");
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
  attachCookiesToResponse,
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
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all details");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Wrong email/password");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong email/password");
  }
  const tokenUser = createTokenUser(user);
  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw UnauthenticatedError("Wrong email/password");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req: AuthRequest, res: Response) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
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
