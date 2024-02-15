import { Request, Response } from "express";
const Product = require("../models/Product");
import { StatusCodes } from "http-status-codes";
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { isTokenValid } = require("../utils/index");
import path from "path";
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
const getAllProduct = async (req: Request, res: Response) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ product, count: product.length });
};
const getSingleProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.body.id);
  try {
    const { token } = req.body;
    const decoded = isTokenValid(token);
    if (decoded.role !== "admin") {
      throw new UnauthenticatedError("User not allowed");
    }
    if (req.files) {
      const prdouctImage = req.files.image;
      if (!prdouctImage.mimetype.startsWith("image")) {
        throw new BadRequestError("Please Upload Image");
      }
      const maxSize = 1024 * 1024 * 10;
      if (prdouctImage.size > maxSize) {
        throw new BadRequestError("Please upload image smaller than 10MB");
      }
      const uniqueFilename = generateUniqueFilename(prdouctImage.name);
      const imagePath = path.join(
        __dirname,
        "../public/uploads/" + `${uniqueFilename}`
      );
      await prdouctImage.mv(imagePath);
      req.body.image = `/uploads/${uniqueFilename}`;
    } else req.body.image = product.image;

    req.body.user = decoded.userId;
    const { id: productId } = req.params;
    const productUpdate = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!productUpdate) {
      throw new NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = isTokenValid(token);
    if (decoded.role !== "admin") {
      throw new UnauthenticatedError("User not allowed");
    }
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }
    await Product.deleteOne({ _id: productId });
    res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    const { token } = req.body;
    const decoded = isTokenValid(token);
    if (decoded.role !== "admin") {
      throw new UnauthenticatedError("User not allowed");
    }
    if (req.files) {
      const prdouctImage = req.files.image;
      if (!prdouctImage.mimetype.startsWith("image")) {
        throw new BadRequestError("Please Upload Image");
      }
      const maxSize = 1024 * 1024 * 10;
      if (prdouctImage.size > maxSize) {
        throw new BadRequestError("Please upload image smaller than 10MB");
      }
      const uniqueFilename = generateUniqueFilename(prdouctImage.name);
      // const product
      const imagePath = path.join(
        __dirname,
        "../public/uploads/" + `${uniqueFilename}`
      );
      await prdouctImage.mv(imagePath);
      req.body.image = `/uploads/${uniqueFilename}`;
    } else req.body.image = "";

    req.body.user = decoded.userId;

    await Product.create(req.body);
    res.status(StatusCodes.OK).json("Product has been created");
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
module.exports = {
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProduct,
};
