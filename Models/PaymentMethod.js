const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
    },
    description: String
});

const PaymentMethod = mongoose.model("paymentMethods", paymentMethodSchema);

module.exports = PaymentMethod;
