import express from "express";
const routes = express.Router();
const { authorizePermissions } = require("../middleware/authentication");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
routes.route("/").get(getAllProduct).post(createProduct);
routes
  .route("/:id")
  .get(getSingleProduct)
  .patch([authorizePermissions("admin")], updateProduct)
  .delete([authorizePermissions("admin")], deleteProduct);
module.exports = routes;
