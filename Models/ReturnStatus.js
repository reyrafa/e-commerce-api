const mongoose = require("mongoose");

const returnStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Return Status Name is required!"],
    },
    description: String,
});

const ReturnStatus = mongoose.model("returnStatus", returnStatusSchema);
module.exports = ReturnStatus;
