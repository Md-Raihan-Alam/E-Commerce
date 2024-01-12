import mongoose, { Document, Schema } from "mongoose";
interface ISingleOrderItem {
  name: string;
  image: string;
  price: number;
  amount: number;
  product: Schema.Types.ObjectId;
}
const SingleOrderItemSchema = new Schema<ISingleOrderItem>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
interface IOrder extends Document {
  deliveryFee: number;
  subtotal: number;
  total: number;
  orderItems: ISingleOrderItem[];
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: Schema.Types.ObjectId;
  clientSecret: string;
  paymentIntentId: string;
}
const OrderSchema = new Schema<IOrder>(
  {
    deliveryFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model<IOrder>("Order", OrderSchema);
