const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STR_KEY);
import { StatusCodes } from "http-status-codes";
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { checkPermissionUser } = require("../utils");
const { isTokenValid } = require("../utils/index");
import { Request, Response } from "express";
interface Results {
  next?: { page: number; limit: number };
  previous?: { page: number; limit: number };
  result: any[] | null;
}
interface CartItem {
  _id: string;
  amount: number;
  orderedQuantity: number;
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
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    return { clientSecret: paymentIntent.client_secret, amount };
  } catch (error: any) {
    console.log(error);
  }
};
const createOrder = async (req: AuthRequest, res: Response) => {
  // console.log(req.body);.

  try {
    const {
      cart: cartItems,
      totalPrice,
      token: checkUser,
      deliveryCost,
    } = req.body;
    const decoded = isTokenValid(checkUser);
    if (!cartItems || cartItems.length < 1) {
      throw new BadRequestError("No cart items provided");
    }
    if (!totalPrice) {
      throw new BadRequestError("Please provide delivery fee");
    }

    let orderItems: OrderItem[] = [];
    let subtotal = 0;

    // Iterate through each item in the cart
    for (const item of cartItems as CartItem[]) {
      const dbProduct = await Product.findOne({ _id: item._id });
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
      await Product.findByIdAndUpdate(_id, { inventory: updatedInventory });

      // Create order item
      const singleOrderItem: OrderItem = {
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
    const result = await fakeStripeAPI({
      amount: finalPrice,
      currency: "usd",
    });
    // console.log(result);
    const order = await Order.create({
      orderItems,
      total: result!.amount,
      subtotal,
      deliveryFee: deliveryCost,
      clientSecret: result!.clientSecret,
      user: decoded.userId,
      userName: decoded.name,
      userImage: decoded.image,
    });
    // console.log("ok");
    res.status(StatusCodes.CREATED).json({ order });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(res.paginationResult);
};
const getCurrentUserOrders = async (req: AuthRequest, res: Response) => {
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
  let results: Results = { result: null };
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  let endIndexNum = await Order.findOne({ user: decoded.userId })
    .countDocuments()
    .exec();
  if (endIndex < endIndexNum) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  } else {
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
  } else {
    results.previous = {
      page: -1,
      limit: limit,
    };
  }
  try {
    results.result = await Order.find({ user: decoded.userId })
      .select("-password  -subtotal -clientSecret  -updatedAt")
      .limit(limit)
      .skip(startIndex)
      .exec();
    return res.status(StatusCodes.OK).json(results);
  } catch (error: any) {
    console.log(error);
  }
};
module.exports = {
  getAllOrders,
  getCurrentUserOrders,
  createOrder,
};
