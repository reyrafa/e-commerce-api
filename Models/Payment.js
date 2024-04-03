const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: [true, "OrderID is required!"],
    },
    userID: {
        type: String,
        required: [true, "UserID is required!"],
    },
    paymentDate: {
        type: Date,
        default: new Date(),
    },
    amount: {
        type: Number,
        required: [true, "Amount is required!"],
    },
    paymentMethodID: {
        type: String,
        required: [true, "PaymentMethodID is required!"],
    },
    paymentStatusID: {
        type: String,
        required: [true, "PaymentStatusID is required!"],
    },
});

const Payment = mongoose.model("payments", paymentSchema);

module.exports = Payment;
