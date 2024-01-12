import express from "express";
const router = express.Router();
const {
  authneticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");
router
  .route("/")
  .post(authneticateUser, createOrder)
  .get(authneticateUser, authorizePermissions("admin"), getAllOrders);
router.route("/myorder").get(authneticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authneticateUser, getSingleOrder)
  .patch(authneticateUser, updateOrder);
module.exports = router;
