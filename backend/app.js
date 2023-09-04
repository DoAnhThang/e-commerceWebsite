const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");

const dotenv = require("dotenv");
dotenv.config();
const URI = process.env.DATABASE_URL;

const User = require("./models/user");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");

const app = express();
// app.set("trust proxy", 1);
const store = new MongoDBStore({
  uri: URI,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("image", 4)
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secretoffx19838", // a secret key used to encrypt the session cookie
    resave: false, // only save session when have the changes of session
    saveUninitialized: false, // prevent create empty session, so help performance
    store: store, // save session to database
    cookie: {
      // path: "/",
      httpOnly: true, // http only, prevents JavaScript cookie access
      sameSite: "lax", // allow the user to maintain a logged in status while arriving from an external link
      secure: false, // determine cookie will be used with HTTPS or not
      maxAge: 12 * 60 * 60 * 1000, // 12h
    },
  })
);

app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ errorMsg: message, data: data });
});

app.use((req, res, next) => {
  res.statusMessage = "Route not found";
  res.status(404).json({ errorMsg: "Route not found" });
});

mongoose
  .connect(URI)
  .then((result) => {
    // app.listen(5000);
    const server = app.listen(process.env.PORT || 5000, () =>
      console.log("Server on " + process.env.PORT)
    );
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      // console.log("Client connected!");
    });
  })
  .catch((err) => console.log(err));
