import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productShema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: [String],
    pictureUrl: { type: String, required: true},
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productShema);
export default Product;


