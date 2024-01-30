const User = require("../models/User");
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { checkPermissionUser } = require("../utils");
const { isTokenValid } = require("../utils/index");
interface AuthRequest extends Request {
  user?: any;
}
const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissionUser(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  try {
    const decoded = isTokenValid(token);
    return res
      .status(StatusCodes.OK)
      .json({ operation: "success", name: decoded });
  } catch (error: any) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ operation: "unsuccess", err: error });
  }
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req: AuthRequest, res: Response) => {};
const updateUserPassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};
module.exports = {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
};
