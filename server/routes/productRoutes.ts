import express from "express";
const Product = require("../models/Product");
const routes = express.Router();
const pagination = require("../middleware/pagination");
const { authorizePermissions } = require("../middleware/authentication");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getRecentProducts,
  getFilterProducts,
} = require("../controllers/productController");
routes.route("/").get(pagination(Product), getAllProduct).post(createProduct);
routes.route("/recent/:id").get(getRecentProducts);
routes.route("/filter").get(getFilterProducts);
routes
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
module.exports = routes;
