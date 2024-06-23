"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { authneticateUser, authorizePermissions, } = require("../middleware/authentication");
const pagination = require("../middleware/pagination");
const Order = require("../models/Order");
const { getAllOrders, getCurrentUserOrders, createOrder, } = require("../controllers/orderController");
router.route("/").post(createOrder).get(pagination(Order), getAllOrders);
router.route("/myorder").post(getCurrentUserOrders);
module.exports = router;
