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
const User = require("../models/User");
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = __importDefault(require("crypto"));
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { sendVerificationEmail, createTokenUser, sendResetPasswordEmail, createHash, } = require("../utils");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Please provide all value" });
        }
        if (name.length >= 21) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Name cannot be more than 20 character" });
        }
        if (password.length <= 6) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Password must be greater than 6 character" });
        }
        const emailAlreadyExist = yield User.findOne({ email }).select("-email");
        if (emailAlreadyExist) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ msg: "Choose another email, this cannon be accepted" });
        }
        const isFirstAccount = (yield User.countDocuments({})) === 0;
        const role = isFirstAccount ? "admin" : "user";
        const verificationToken = crypto_1.default.randomBytes(40).toString("hex");
        const user = yield User.create({
            name,
            email,
            password,
            role,
            verificationToken,
        });
        const origin = "http://localhost:5173/";
        yield sendVerificationEmail({
            name: user.name,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ msg: "You should receive an email for verification" });
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Some error occured try again later" });
    }
});
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken, email } = req.body;
    // console.log(req.body);
    const user = yield User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Email not found");
    }
    if (user.verificationToken !== verificationToken) {
        throw new UnauthenticatedError("Verfication failed");
    }
    user.isVerified = true;
    user.verified = Date.now();
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Email Verified" });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError("Please provide all details");
        }
        const user = yield User.findOne({ email }).select("-email");
        // console.log(user);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Wrong email/password" });
        }
        const isPasswordCorrect = yield user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Wrong email/password" });
        }
        const tokenUser = createTokenUser(user);
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser, token: token });
    }
    catch (error) {
        console.log(error);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user logged out!" });
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new BadRequestError("Please provide valid email");
    }
    const user = yield User.findOne({ email });
    console.log("User=" + user);
    if (user) {
        const passwordToken = crypto_1.default.randomBytes(70).toString("hex");
        const origin = "http://localhost:5173/";
        // console.log(user);
        const result = yield sendResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: passwordToken,
            origin,
        });
        const twentyMinutes = 1000 * 60 * 20;
        const passwordTokenExpirationDate = new Date(Date.now() + twentyMinutes);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        yield user.save();
        console.log("OK");
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            msg: "Please check you email for reset password link",
            res: result,
        });
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "Please check you email for reset password link" });
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
        throw new BadRequestError("Please provide all values");
    }
    const user = yield User.findOne({ email });
    if (user) {
        const currentDate = new Date();
        if (user.passwordToken === createHash(token) &&
            user.passwordTokenExpirationDate > currentDate) {
            user.password = password;
            user.passwordToken = "";
            user.passwordTokenExpirationDate = null;
            yield user.save();
        }
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password has been reset" });
});
module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
};
