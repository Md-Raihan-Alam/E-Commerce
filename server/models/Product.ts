import mongoose, { Schema } from "mongoose";
interface productType extends Document {
  name: String;
  price: Number;
  description: String;
  image: String;
  freeDelivery: Boolean;
  inventory: Number;
  averageRating: Number;
  author: String;
  user: Schema.Types.ObjectId;
}
const productSchema = new mongoose.Schema<productType>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide produt description"],
      maxlength: [1000, "Description can not be more than 1000 character"],
    },
    image: {
      type: String,
      default: "/uploads/product-default,jpeg",
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: [true, "Please provide author name"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = mongoose.model<productType>("Product", productSchema);
