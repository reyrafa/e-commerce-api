const mongoose = require("mongoose");

const paymentStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Payment Status Name is required!"],
    },
    description: String,
});

const PaymentStatus = mongoose.model("paymentStatus", paymentStatusSchema);

module.exports = PaymentStatus;
