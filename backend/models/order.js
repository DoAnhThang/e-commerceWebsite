const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
    },
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalQuantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    delivery: { type: String, default: "Waiting for progressing" },
    status: { type: String, default: "Waiting for pay" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
