import express from "express";
const routes = express.Router();
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
routes.route("/").get(getAllProduct).post(createProduct);
routes.route("/recent/:id").get(getRecentProducts);
routes.route("/filter").get(getFilterProducts);
routes
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
module.exports = routes;
