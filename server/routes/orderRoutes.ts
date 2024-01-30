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
  .post(createOrder)
  .get(authorizePermissions("admin"), getAllOrders);
router.route("/myorder").get(getCurrentUserOrders);
router.route("/:id").get(getSingleOrder).patch(updateOrder);
module.exports = router;
