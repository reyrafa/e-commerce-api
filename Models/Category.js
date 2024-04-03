const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required!"],
    },
    description: String,
});

const Categories = mongoose.model("categories", categorySchema);

module.exports = Categories;
