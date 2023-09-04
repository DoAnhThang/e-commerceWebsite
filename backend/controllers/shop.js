const io = require("../socket");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const ejs = require("ejs");

const Product = require("../models/product");
const Order = require("../models/order");
const ChatSession = require("../models/chatSession");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.json({ errorMsg: "Products not found" });
    }
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ errorMsg: "Product not found" });
    }
    const relatedProducts = await Product.find({ category: product.category });
    res.status(200).json({
      product: product,
      relatedProducts: relatedProducts.filter(
        (prod) => prod._id.toString() !== product._id.toString()
      ),
    });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const cart = user.cart;
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = parseInt(req.body.quantity);
  try {
    const product = await Product.findById(prodId);
    const userDoc = await req.user.addToCart(product, quantity);
    const result = await userDoc.populate("cart.items.productId");
    res.status(200).json(result.cart);
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    const userDoc = await req.user.removeFromCart(product);
    const result = await userDoc.populate("cart.items.productId");
    res.status(200).json(result.cart);
  } catch (err) {
    next(err);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    const userDoc = await req.user.deleteFromCart(product);
    const result = await userDoc.populate("cart.items.productId");
    res.status(200).json(result.cart);
  } catch (err) {
    next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = errors.mapped();
    return res.status(422).json(errorObj);
  }
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => ({
      quantity: i.quantity,
      product: { ...i.productId._doc },
    }));

    // update products remain
    const productIds = products.map((prod) => prod.product._id);
    const productsNeedUpdate = await Product.find({ _id: { $in: productIds } });
    productsNeedUpdate.forEach((item) => {
      const product = products.find(
        (prod) => prod.product._id.toString() === item._id.toString()
      );
      item.remain -= product.quantity;
      item.save();
    });

    const order = new Order({
      userId: req.user._id,
      receiver: { fullName, email, phoneNumber, address },
      products: products,
      totalQuantity: user.cart.totalQuantity,
      totalAmount: user.cart.totalAmount,
    });
    const orderDoc = await order.save();

    const userDoc = await req.user.clearCart();
    const result = await userDoc.populate("cart.items.productId");
    res.status(200).json({
      isSuccess: true,
      message: {
        msg: "Order successfully! Please check billing email for confirmation.",
      },
      cart: result.cart,
    });
    const htmlTemplate = `
      <head>
        <meta http-equiv="Cross-Origin-Resource-Policy" content="same-site" />
        <style>
          th, td { border: 1px solid white; padding: 1rem; }
        </style>
      </head>
      <html>
        <body style="background-color: #000; color: #fff; padding-left: 3rem; padding-top: 1.5rem;">
          <h1>Xin chào ${fullName}</h1>
          <h3>Phone: ${phoneNumber}</h3>
          <h3>Address: ${address}</h3>
          <h3>Thời gian đặt hàng: ${orderDoc.createdAt.toLocaleString(
            "en-GB"
          )}</h3><br>
          <table>
            <thead>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th>Hình Ảnh</th>
                <th>Giá</th>
                <th>Số Lượng</th>
                <th>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              <% products.forEach((p) => { %>
                <tr style="font-size: 1.2rem; text-align: center">
                  <td><%= p.product.name %></td>
                  <td><img src=<%= p.product.img1.includes("images") ? "http://localhost:5000/" + p.product.img1 : p.product.img1 %> alt=<%= p.product.name %> style="width: 5rem;" /></td>
                  <td><%= (p.product.price * 1).toLocaleString("vi", { style: "currency", currency: "VND" }).slice(0, -2) %><br>VND</td>
                  <td><%= p.quantity %></td>
                  <td><%= (p.product.price * p.quantity).toLocaleString("vi", { style: "currency", currency: "VND" }).slice(0, -2) %><br>VND</td>
                </tr>
              <% }) %>
            </tbody>
          </table>
          <h1>Tổng Thanh Toán:</h1>
          <h1>${orderDoc.totalAmount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND</h1><br>
          <h1>Cảm ơn bạn!</h1>
        </body>
      </html>`;
    const html = ejs.render(htmlTemplate, { products: orderDoc.products });
    return transporter.sendMail(
      {
        from: "thangdafx19838@funix.edu.vn",
        to: email,
        subject: `INFORMATION ORDER (ID: ${orderDoc._id})`,
        html: html,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: ", info);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    const chatSession = await ChatSession.findById(roomId);
    res.status(200).json(chatSession);
  } catch (err) {
    next(err);
  }
};

exports.putMessage = async (req, res, next) => {
  const roomId = req.body.roomId;
  const message = req.body.newMsg;
  try {
    if (!roomId) {
      const chatSession = new ChatSession({
        messages: [{ role: "client", msg: message }],
      });
      const result = await chatSession.save();

      const chatSessions = await ChatSession.find().sort({ updatedAt: -1 });
      const roomIds = chatSessions.map((room) => room._id.toString());
      io.getIO().emit("clientMsg", {
        action: "create",
        roomIds: roomIds,
      });

      return res.status(200).json({
        message: "roomId created!",
        messages: result.messages,
        roomId: result._id,
      });
    } else {
      const room = await ChatSession.findById(roomId);
      room.messages.push({ role: "client", msg: message });
      const result = await room.save();

      io.getIO().emit("clientMsg", {
        action: "update",
        roomId: roomId,
        messages: result.messages,
        // newMsg: message,
      });

      res.status(200).json({
        message: "Message has been pushed!",
        messages: result.messages,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteChatSession = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    await ChatSession.findByIdAndRemove(roomId);

    io.getIO().emit("clientMsg", {
      action: "delete",
      roomId: roomId,
    });

    res.status(200).json({ isSuccess: true, message: "Chat session deleted!" });
  } catch (err) {
    next(err);
  }
};
