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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEmail = (email) => {
    return validator_1.default.isEmail(email);
};
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please fulfil all data"],
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please fulfil all data"],
        validate: {
            validator: validateEmail,
            message: "Please provide valid email",
        },
    },
    address: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Please fulfil all data"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    image: {
        type: String,
        default: "",
    },
    verificationToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Date,
    },
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date,
    },
});
UserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(String(this.password), salt);
    });
});
UserSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({
        name: this.name,
        userId: this._id,
        role: this.role,
        address: this.address,
        image: this.image,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(String(candidatePassword), this.password);
        return isMatch;
    });
};
module.exports = mongoose_1.default.model("User", UserSchema);
