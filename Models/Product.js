const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required!"],
        },
        description: {
            type: String,
            required: [true, "Description is required!"],
        },

        model: {
            type: String,
            required: [true, "Model is required!"],
        },
        color: {
            type: String,
            required: [true, "Color is required!"],
        },
        price: {
            type: Number,
            required: [true, "Price is required!"],
        },
        stock: {
            type: Number,
            required: [true, "Stock is required!"],
        },
        images: [
            {
                type: String,
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
        categoryID: {
            type: String,
            required: [true, "Category is required!"],
            ref: "categories"
        },
        sku: {
            type: String,
            required: [true, "SKU is required!"],
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
