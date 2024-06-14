import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
const User = require("../models/User");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { checkPermissionUser, createTokenUser } = require("../utils");
const { isTokenValid } = require("../utils/index");

interface File {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (path: string) => void;
}

interface Files {
  image: File;
}

interface AuthRequest extends Request {
  user?: any;
  files?: Files;
}

const generateUniqueFilename = (originalFilename: string) => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "");
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalFilename);

  const sanitizedOriginalFilename = originalFilename.replace(/\s+/g, "_");

  return `${timestamp}_${randomString}_${sanitizedOriginalFilename}${extension}`;
};

const getAllUsers = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(res.paginationResult);
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
};

const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { token, name, address } = req.body;
    const decoded = isTokenValid(token);
    const productImage = req.files?.image;
    if (
      productImage !== undefined &&
      !productImage.mimetype.startsWith("image")
    ) {
      return res.status(StatusCodes.OK).json({ msg: "Please upload image" });
    }

    const maxSize = 1024 * 2014 * 10;
    if (productImage !== undefined && productImage.size > maxSize) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Please upload image smaller than 10MB" });
    }

    let uniqueProfilePictureName: string | undefined;
    let imagePath: string | undefined;
    if (productImage !== undefined) {
      uniqueProfilePictureName = generateUniqueFilename(productImage.name);
      imagePath = path.join(
        __dirname,
        "../public/uploads/",
        uniqueProfilePictureName
      );
    }

    if (productImage !== undefined && imagePath !== undefined) {
      await productImage.mv(imagePath);
    }

    const user = await User.findOne({ _id: decoded.userId });
    user.address = address;
    user.name = name;
    if (productImage !== undefined && uniqueProfilePictureName !== undefined) {
      user.image = `/uploads/${uniqueProfilePictureName}`;
    }
    await user.save();
    const tokenUser = createTokenUser(user);
    res
      .status(StatusCodes.OK)
      .json({ msg: "Success! Profile Updated", user: tokenUser });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateUserPassword = async (req: AuthRequest, res: Response) => {
  const { token, password } = req.body;
  const decoded = isTokenValid(token);
  if (!password.oldPassword || !password.newPassword) {
    throw new BadRequestError("Please provide values");
  }
  const user = await User.findOne({ _id: decoded.userId });
  const isPasswordCorrect = await user.comparePassword(password.oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  user.password = password.newPassword;
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
