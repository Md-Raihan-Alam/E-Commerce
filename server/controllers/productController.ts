import { Request, Response } from "express";
const Product = require("../models/Product");
import { StatusCodes } from "http-status-codes";
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
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
const updateProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};
const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files) {
      throw new BadRequestError("No File uploaded");
    }
    const prdouctImage = req.files.image;
    if (!prdouctImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please Upload Image");
    }
    const maxSize = 1024 * 1024;
    if (prdouctImage.size > maxSize) {
      throw new BadRequestError("Please upload image smaller than 1MB");
    }
    const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${prdouctImage.name}`
    );
    await prdouctImage.mv(imagePath);
    req.body.user = req.user.userId;
    console.log(req.body);
    req.body.image = `../public/uploads/${prdouctImage.name}`;
    const newProduct = await Product.create(req.body);
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
