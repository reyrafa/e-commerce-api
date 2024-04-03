const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [true, "UserID is required!"],
    },
    orderDate: {
        type: Date,
        default: new Date(),
    },
    totalAmount: {
        type: Number,
        required: [true, "totalAmount is required!"],
    },
    statusID: {
        type: String,
        required: [true, "statusID is required"],
    },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
