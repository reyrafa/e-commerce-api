const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required!"],
        },
        emailVerifiedDate: {
            type: Date,
            default: null,
        },
        firstName: {
            type: String,
            required: [true, "Firstname is required!"],
        },
        lastName: {
            type: String,
            required: [true, "Lastname is required!"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required"],
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
