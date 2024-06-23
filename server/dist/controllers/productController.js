"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product = require("../models/Product");
const http_status_codes_1 = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError, } = require("../errors");
const { isTokenValid } = require("../utils/index");
const path_1 = __importDefault(require("path"));
const hasNumber = (value) => {
    return /\d/.test(value);
};
const generateUniqueFilename = (originalFilename) => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "");
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path_1.default.extname(originalFilename);
    const sanitizedOriginalFilename = originalFilename.replace(/\s+/g, "_");
    return `${timestamp}_${randomString}_${sanitizedOriginalFilename}${extension}`;
};
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json(res.paginationResult);
});
const getRecentProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // console.log(id);
        const recentProducts = yield Product.find({ _id: { $ne: id } })
            .sort({ updatedAt: -1 })
            .limit(4);
        res.status(http_status_codes_1.StatusCodes.OK).json({ products: recentProducts });
    }
    catch (error) {
        console.error("Error fetching recently updated products:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
    }
});
const getFilterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { min_price, max_price, rating } = req.query;
        const filter = {};
        if (min_price !== undefined && max_price !== undefined) {
            const min = parseInt(min_price);
            const max = parseInt(max_price);
            if (max === 0 && min === 0) {
            }
            else if (max === 0 && min !== 0) {
                filter.price = { $gte: min };
            }
            else if (max !== 0 && min === 0) {
                filter.price = { $lte: max };
            }
            else if (max >= min) {
                filter.price = { $gte: min, $lte: max };
            }
            else if (max < min) {
                filter.price = { $gte: min };
            }
        }
        else if (min_price !== undefined) {
            filter.price = { $gte: parseInt(min_price) };
        }
        else if (max_price !== undefined) {
            filter.price = { $lte: parseInt(max_price) };
        }
        if (rating !== undefined && hasNumber(rating)) {
            filter.averageRating = { $gte: parseFloat(rating) };
        }
        const filterProducts = yield Product.find(filter);
        res.status(http_status_codes_1.StatusCodes.OK).json({ products: filterProducts });
    }
    catch (error) {
        console.error("Error fetching filtered products:", error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
});
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield Product.findOne({ _id: productId });
    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product.findById(req.body.id);
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
            const imagePath = path_1.default.join(__dirname, "../public/uploads/" + `${uniqueFilename}`);
            yield prdouctImage.mv(imagePath);
            req.body.image = `/uploads/${uniqueFilename}`;
        }
        else
            req.body.image = product.image;
        req.body.user = decoded.userId;
        const { id: productId } = req.params;
        const productUpdate = yield Product.findOneAndUpdate({ _id: productId }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!productUpdate) {
            throw new NotFoundError(`No product with id : ${productId}`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ product });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: productId } = req.params;
        const product = yield Product.findById(productId);
        if (!product) {
            throw new NotFoundError(`No product with id: ${productId}`);
        }
        yield Product.deleteOne({ _id: productId });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Success! Product removed" });
    }
    catch (error) {
        console.error(error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Internal Server Error" });
    }
});
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, name, price, description, inventory, averageRating, author, } = req.body;
        const decoded = isTokenValid(token);
        if (decoded.role !== "admin") {
            return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "You are not allowed" });
        }
        if (!name ||
            !price ||
            !description ||
            !inventory ||
            !averageRating ||
            !author) {
            const missingFields = [];
            if (!name)
                missingFields.push("give product name");
            if (!price)
                missingFields.push("price");
            if (!description)
                missingFields.push("description");
            if (!inventory)
                missingFields.push("inventory");
            if (!averageRating)
                missingFields.push("averageRating");
            if (!author)
                missingFields.push("author");
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                msg: `Fill up the missing information: ${missingFields.join(", ")}`,
            });
        }
        if (name.length > 20) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Product name should not be more than 20 characters" });
        }
        if (description.length > 500) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Description should not be more than 500 characters" });
        }
        if (req.files) {
            const productImage = req.files.image;
            if (!productImage.mimetype.startsWith("image")) {
                throw new BadRequestError("Please Upload Image");
            }
            const maxSize = 1024 * 1024 * 10;
            if (productImage.size > maxSize) {
                throw new BadRequestError("Please upload image smaller than 10MB");
            }
            const uniqueFilename = generateUniqueFilename(productImage.name);
            const imagePath = path_1.default.join(__dirname, "../public/uploads/" + `${uniqueFilename}`);
            yield productImage.mv(imagePath);
            req.body.image = `/uploads/${uniqueFilename}`;
        }
        else {
            req.body.image = "";
        }
        req.body.user = decoded.userId;
        yield Product.create(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Product has been created" });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
});
module.exports = {
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProduct,
    getRecentProducts,
    getFilterProducts,
};
