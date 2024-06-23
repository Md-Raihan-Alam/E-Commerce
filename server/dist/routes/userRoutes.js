"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const pagination = require("../middleware/pagination");
const User = require("../models/User");
const { getAllUsers, getSingleUser, updateUserPassword, updateUser, showCurrentUser, } = require("../controllers/userController");
router.route("/").get(pagination(User), getAllUsers);
router.route("/showMe").post(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:id").get(getSingleUser);
module.exports = router;
