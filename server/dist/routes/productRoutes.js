"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product = require("../models/Product");
const routes = express_1.default.Router();
const pagination = require("../middleware/pagination");
const { authorizePermissions } = require("../middleware/authentication");
const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct, getRecentProducts, getFilterProducts, } = require("../controllers/productController");
routes.route("/").get(pagination(Product), getAllProduct).post(createProduct);
routes.route("/recent/:id").get(getRecentProducts);
routes.route("/filter").get(getFilterProducts);
routes
    .route("/:id")
    .get(getSingleProduct)
    .patch(updateProduct)
    .delete(deleteProduct);
module.exports = routes;
