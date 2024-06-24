import express from "express";
const router = express.Router();
const {
  authneticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const pagination = require("../middleware/pagination");
const Order = require("../models/Order");
const {
  getAllOrders,
  getCurrentUserOrders,
  createOrder,
} = require("../controllers/orderController");
router.route("/").post(createOrder).get(pagination(Order), getAllOrders);
router.route("/myorder").post(getCurrentUserOrders);
module.exports = router;
