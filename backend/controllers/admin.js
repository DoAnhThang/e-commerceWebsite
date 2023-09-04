const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const io = require("../socket");

const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const ChatSession = require("../models/chatSession");

exports.getDashboard = async (req, res, next) => {
  try {
    const clients = await User.find({ role: "client" });
    const orders = await Order.find().populate("userId", "role");
    const clientOrders = orders
      .filter((order) => order.userId.role === "client")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.status(200).json({
      dashboard: {
        clients: clients.length,
        clientOrders: clientOrders.length,
      },
      lastestOrders: clientOrders.slice(0, 8),
    });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getSearchedProducts = async (req, res, next) => {
  const keyword = req.query.keyword;
  try {
    const searchResult = await Product.find({
      name: { $regex: keyword, $options: "i" },
    });
    res.status(200).json(searchResult);
  } catch (err) {
    next(err);
  }
};

exports.postAddProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (req.files.length === 0) {
    if (!errors.isEmpty()) {
      let errorObj = errors.mapped();
      errorObj = { ...errorObj, image: { msg: "No image provided" } };
      return res.status(422).json(errorObj);
    }
  }
  if (!errors.isEmpty()) {
    const errorObj = errors.mapped();
    return res.status(422).json(errorObj);
  }

  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const remain = parseInt(req.body.remain);
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const image1 = req.files[0].path.replace(/\\/g, "/");
  const image2 = req.files[1] ? req.files[1].path.replace(/\\/g, "/") : "";
  const image3 = req.files[2] ? req.files[2].path.replace(/\\/g, "/") : "";
  const image4 = req.files[3] ? req.files[3].path.replace(/\\/g, "/") : "";

  try {
    const product = new Product({
      name: name,
      category: category,
      price: price,
      remain: remain,
      short_desc: short_desc,
      long_desc: long_desc,
      img1: image1,
      img2: image2,
      img3: image3,
      img4: image4,
    });
    await product.save();
    res
      .status(201)
      .json({ isSuccess: true, message: "Product created successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(204).json({ errorMsg: "No product matching ID!" });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.putEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorObj = errors.mapped();
    return res.status(422).json(errorObj);
  }

  const prodId = req.params.productId;
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const remain = parseInt(req.body.remain);
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(204).json({ errorMsg: "No product matching ID!" });
    }
    product.name = name;
    product.category = category;
    product.price = price;
    product.remain = remain;
    product.short_desc = short_desc;
    product.long_desc = long_desc;
    if (req.files.length > 0) {
      clearImage(product.img1);
      if (product.img2) {
        clearImage(product.img2);
        product.img2 = "";
      }
      if (product.img3) {
        clearImage(product.img3);
        product.img3 = "";
      }
      if (product.img4) {
        clearImage(product.img4);
        product.img4 = "";
      }
      product.img1 = req.files[0].path;
      if (req.files[1]) product.img2 = req.files[1].path;
      if (req.files[2]) product.img3 = req.files[2].path;
      if (req.files[3]) product.img4 = req.files[3].path;
    }
    await product.save();
    res
      .status(200)
      .json({ isSuccess: true, message: "Updated product!", product: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(204).json({ errorMsg: "No product matching ID!" });
    }
    await Product.findByIdAndRemove(prodId);
    if (product.img1) clearImage(product.img1);
    if (product.img2) clearImage(product.img2);
    if (product.img3) clearImage(product.img3);
    if (product.img4) clearImage(product.img4);
    res.status(200).json({ message: "Deleted product!" });
  } catch (err) {
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

exports.getRooms = async (req, res, next) => {
  try {
    const chatSessions = await ChatSession.find().sort({ updatedAt: -1 });
    const roomIds = chatSessions.map((room) => room._id.toString());
    res.status(200).json(roomIds);
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
    const room = await ChatSession.findById(roomId);
    if (!room) {
      return res.json({ errorMsg: "No chat session found!" });
    }
    room.messages.push({ role: req.user.role, msg: message });
    const result = await room.save();

    io.getIO().emit("adminMsg", {
      action: "update",
      roomId: roomId,
      messages: result.messages,
    });

    res
      .status(200)
      .json({ message: "Message has been pushed!", messages: result.messages });
  } catch (err) {
    next(err);
  }
};
