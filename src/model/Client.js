import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: Number,
    productId: Number,
  },{timestamps: true }
);
const Client = mongoose.model('Client', clientSchema);
export default Client;