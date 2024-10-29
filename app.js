const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

// 3rd-party
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);

const app = express();
dotenv.config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.pfazc8v.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

// import routes
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(helmet());
app.use(compression());

// use 3rd-party
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ecommerce-hieuphan.vercel.app",
      "e-commerce-client-smoky-ten.vercel.app",
    ],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// use routes
app.use(shopRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  return res.status(500).json({ error: { message: "Error occured" } });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  app.listen(parseInt(process.env.PORT) || 5500, (err) => {
    if (!err) console.log(`Server running on port ${process.env.PORT}`);
  });
}

main().catch((err) => console.log(err));
