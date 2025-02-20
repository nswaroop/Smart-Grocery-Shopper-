const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")
const errorMiddleware = require("./middleware/error");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const {sampleProducts,sampleUsers,Productsdata} = require("./config/rawdata")


dotenv.config({path : "backend/config/config.env"})
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json({ limit: "50mb" })); 
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());



const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");



app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);


app.get('/add-products', async (req, res) => {
    try {
        const result = await Product.insertMany(Productsdata);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/add-users', async (req, res) => {
  try {
      const result = await User.insertMany(sampleUsers);
      res.send(result);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;