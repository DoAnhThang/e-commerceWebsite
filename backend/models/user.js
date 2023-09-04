const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
      totalQuantity: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
    },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.addToCart = function (prod, qty) {
  const cartProductIndex = this.cart.items.findIndex(
    (p) => p.productId.toString() === prod._id.toString()
  );
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += qty;
  } else {
    updatedCartItems.push({
      productId: prod._id,
      quantity: qty,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
    totalQuantity: this.cart.totalQuantity + qty,
    totalAmount: this.cart.totalAmount + parseInt(prod.price) * qty,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (prod) {
  const cartProductIndex = this.cart.items.findIndex(
    (p) => p.productId.toString() === prod._id.toString()
  );
  const updatedCartItems = [...this.cart.items];

  updatedCartItems[cartProductIndex].quantity--;
  const updatedCart = {
    items: updatedCartItems,
    totalQuantity: this.cart.totalQuantity - 1,
    totalAmount: this.cart.totalAmount - parseInt(prod.price),
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (prod) {
  const cartProductIndex = this.cart.items.findIndex(
    (p) => p.productId.toString() === prod._id.toString()
  );
  const updatedCartItems = [...this.cart.items];

  const updatedCart = {
    items: this.cart.items.filter(
      (p) => p.productId.toString() !== prod._id.toString()
    ),
    totalQuantity:
      this.cart.totalQuantity - this.cart.items[cartProductIndex].quantity,
    totalAmount:
      this.cart.totalAmount -
      this.cart.items[cartProductIndex].quantity * parseInt(prod.price),
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [], totalQuantity: 0, totalAmount: 0 };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
