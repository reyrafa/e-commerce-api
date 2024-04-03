const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 4003;

const app = express();

//routes
const userRoutes = require("./Routes/user.js");
const categoryRoutes = require("./Routes/category.js");
const productRoutes = require("./Routes/product.js");
const orderRoutes = require("./Routes/order.js");
const orderStatusRoutes = require("./Routes/orderStatus.js");
const paymentMethodRoutes = require("./Routes/paymentMethod.js");
const paymentStatusRoutes = require("./Routes/paymentStatus.js");
const paymentRoutes = require("./Routes/payment.js");

mongoose.connect(
    "mongodb+srv://admin:admin@b330costemianodb.brxgltr.mongodb.net/ECommerceAPI?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log(`The server is connected with the database`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/orderStatus", orderStatusRoutes);
app.use("/paymentMethods", paymentMethodRoutes);
app.use("/paymentStatus", paymentStatusRoutes);
app.use("/payments", paymentRoutes);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
