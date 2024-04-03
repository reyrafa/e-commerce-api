const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Return Status Name is required!"],
    },
    description: String,
});

const orderStatus = mongoose.model("orderStatus", orderStatusSchema);
module.exports = orderStatus;
