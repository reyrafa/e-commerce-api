const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: [true, "OrderID is required"],
    },
    productID: {
        type: String,
        required: [true, "ProductID is required!"],
        ref: "products",
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required!"],
    },
    subTotal: {
        type: Number,
        required: [true, "SubTotal is required!"],
    },
});

const OrderItem = mongoose.model("orderItems", orderItemSchema);

module.exports = OrderItem;
