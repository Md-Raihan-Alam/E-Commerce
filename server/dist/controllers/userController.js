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
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError, NotFoundError, } = require("../errors");
const { checkPermissionUser, createTokenUser } = require("../utils");
const { isTokenValid } = require("../utils/index");
const generateUniqueFilename = (originalFilename) => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "");
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path_1.default.extname(originalFilename);
    const sanitizedOriginalFilename = originalFilename.replace(/\s+/g, "_");
    return `${timestamp}_${randomString}_${sanitizedOriginalFilename}${extension}`;
};
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json(res.paginationResult);
});
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
        throw new NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermissionUser(req.user, user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const decoded = isTokenValid(token);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ operation: "success", name: decoded });
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ operation: "unsuccess", err: error });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { token, name, address } = req.body;
        const decoded = isTokenValid(token);
        const productImage = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
        if (productImage !== undefined &&
            !productImage.mimetype.startsWith("image")) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Please upload image" });
        }
        const maxSize = 1024 * 2014 * 10;
        if (productImage !== undefined && productImage.size > maxSize) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Please upload image smaller than 10MB" });
        }
        let uniqueProfilePictureName;
        let imagePath;
        if (productImage !== undefined) {
            uniqueProfilePictureName = generateUniqueFilename(productImage.name);
            imagePath = path_1.default.join(__dirname, "../public/uploads/", uniqueProfilePictureName);
        }
        if (productImage !== undefined && imagePath !== undefined) {
            yield productImage.mv(imagePath);
        }
        const user = yield User.findOne({ _id: decoded.userId });
        user.address = address;
        user.name = name;
        if (productImage !== undefined && uniqueProfilePictureName !== undefined) {
            user.image = `/uploads/${uniqueProfilePictureName}`;
        }
        yield user.save();
        const tokenUser = createTokenUser(user);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ msg: "Success! Profile Updated", user: tokenUser });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
});
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    const decoded = isTokenValid(token);
    if (!password.oldPassword || !password.newPassword) {
        throw new BadRequestError("Please provide values");
    }
    const user = yield User.findOne({ _id: decoded.userId });
    const isPasswordCorrect = yield user.comparePassword(password.oldPassword);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    user.password = password.newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Success! Password Updated" });
});
module.exports = {
    getAllUsers,
    getSingleUser,
    updateUserPassword,
    updateUser,
    showCurrentUser,
};
