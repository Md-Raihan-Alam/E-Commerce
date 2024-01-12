const Order = require("../models/Order");
const Product = require("../models/Product");
import { StatusCodes } from "http-status-codes";
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { checkPermissionUser } = require("../utils");
import { Request, Response } from "express";
interface CartItem {
  product: string;
  amount: number;
}
interface OrderItem {
  amount: number;
  name: string;
  price: number;
  image: string;
  product: string;
}
interface FakeStripeApiResponse {
  client_secret: string;
  amount: number;
}
interface AuthRequest extends Request {
  user?: any;
}
const fakeStripeAPI = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};
const createOrder = async (req: AuthRequest, res: Response) => {
  const { item: cartItems, deliveryFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!deliveryFee) {
    throw new BadRequestError("Please provide delivery fee");
  }
  let orderItems: OrderItem[] = [];
  let subtotal = 0;
  for (const item of cartItems as CartItem[]) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with itd :${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem: OrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = deliveryFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    deliveryFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ order });
};
const getAllOrders = async (req: Request, res: Response) => {
  const order = await Order.find({});
  res.status(StatusCodes.OK).json({ order, count: order.length });
};
const getSingleOrder = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id: ${orderId}`);
  }
  checkPermissionUser(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ order, count: order.length });
};
const updateOrder = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id:${orderId}`);
  }
  checkPermissionUser(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
