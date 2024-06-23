import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
interface IUser extends Document {
  name: String;
  email: string;
  address: String | null;
  password: String;
  role: "admin" | "user";
  image?: String;
  verificationToken?: String;
  isVerified: boolean;
  verified?: Date;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
}
const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};
const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
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
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(String(this.password), salt);
});
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      name: this.name,
      userId: this._id,
      role: this.role,
      address: this.address,
      image: this.image,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
UserSchema.methods.comparePassword = async function (
  candidatePassword: String
) {
  const isMatch = await bcrypt.compare(
    String(candidatePassword),
    this.password
  );
  return isMatch;
};
module.exports = mongoose.model<IUser>("User", UserSchema);
