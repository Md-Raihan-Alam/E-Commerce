import express from "express";
const routes = express.Router();
const {
  authneticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
routes
  .route("/")
  .get(getAllProduct)
  .post([authneticateUser, authorizePermissions("admin")], createProduct);
routes
  .route("/:id")
  .get(getSingleProduct)
  .patch([authneticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authneticateUser, authorizePermissions("admin")], deleteProduct);
module.exports = routes;
