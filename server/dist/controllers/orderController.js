"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STR_KEY);
const http_status_codes_1 = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError, } = require("../errors");
const { checkPermissionUser } = require("../utils");
const { isTokenValid } = require("../utils/index");
const fakeStripeAPI = ({ amount, currency, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
        return { clientSecret: paymentIntent.client_secret, amount };
    }
    catch (error) {
        console.log(error);
    }
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);.
    try {
        const { cart: cartItems, totalPrice, token: checkUser, deliveryCost, } = req.body;
        const decoded = isTokenValid(checkUser);
        if (!cartItems || cartItems.length < 1) {
            throw new BadRequestError("No cart items provided");
        }
        if (!totalPrice) {
            throw new BadRequestError("Please provide delivery fee");
        }
        let orderItems = [];
        let subtotal = 0;
        // Iterate through each item in the cart
        for (const item of cartItems) {
            const dbProduct = yield Product.findOne({ _id: item._id });
            if (!dbProduct) {
                throw new NotFoundError(`No product with id: ${item._id}`);
            }
            const { name, price, image, _id, inventory } = dbProduct;
            // Calculate ordered quantity and update inventory
            const orderedQuantity = Math.min(item.orderedQuantity, inventory);
            const updatedInventory = inventory - orderedQuantity;
            // console.log(dbProduct);
            // console.log(decoded);
            // console.log(deliveryCost);
            // Update product inventory
            yield Product.findByIdAndUpdate(_id, { inventory: updatedInventory });
            // Create order item
            const singleOrderItem = {
                amount: orderedQuantity,
                name,
                price,
                image,
                product: _id,
            };
            orderItems.push(singleOrderItem);
            subtotal += orderedQuantity * price;
        }
        // console.log("Subtotal =" + subtotal);
        const finalPrice = subtotal + deliveryCost;
        // console.log("ok");
        const result = yield fakeStripeAPI({
            amount: finalPrice,
            currency: "usd",
        });
        // console.log(result);
        const order = yield Order.create({
            orderItems,
            total: result.amount,
            subtotal,
            deliveryFee: deliveryCost,
            clientSecret: result.clientSecret,
            user: decoded.userId,
            userName: decoded.name,
            userImage: decoded.image,
        });
        // console.log("ok");
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ order });
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json(res.paginationResult);
});
const getCurrentUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token: Token } = req.body;
    const decoded = isTokenValid(Token);
    let page = 1;
    let limit = 5;
    if (req.query.page !== undefined) {
        page = Number(req.query.page);
    }
    if (req.query.limit !== undefined) {
        limit = Number(req.query.limit);
    }
    let results = { result: null };
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let endIndexNum = yield Order.findOne({ user: decoded.userId })
        .countDocuments()
        .exec();
    if (endIndex < endIndexNum) {
        results.next = {
            page: page + 1,
            limit: limit,
        };
    }
    else {
        results.next = {
            page: -1,
            limit: limit,
        };
    }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        };
    }
    else {
        results.previous = {
            page: -1,
            limit: limit,
        };
    }
    try {
        results.result = yield Order.find({ user: decoded.userId })
            .select("-password  -subtotal -clientSecret  -updatedAt")
            .limit(limit)
            .skip(startIndex)
            .exec();
        return res.status(http_status_codes_1.StatusCodes.OK).json(results);
    }
    catch (error) {
        console.log(error);
    }
});
module.exports = {
    getAllOrders,
    getCurrentUserOrders,
    createOrder,
};
