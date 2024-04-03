const express = require("express");

const router = express.Router();

const auth = require("../auth.js");
const categoryController = require("../Controllers/category.js");

// add a category
router.post(
    "/add-category",
    auth.verifyToken,
    auth.verifyAdmin,
    categoryController.doesCategoryExist,
    categoryController.addCategory
);

// update a category
router.put(
    "/update-category/:id",
    auth.verifyToken,
    auth.verifyAdmin,
    categoryController.updateCategory
);

//fetch all categories
router.get(
    "/categories-list",
    categoryController.fetchCategories
);

// fetch a single category by id
router.get(
    "/category/:id",
    auth.verifyToken,
    auth.verifyAdmin,
    categoryController.fetchSingleCategory
);

// delete a category
router.delete(
    "/delete-category/:id",
    auth.verifyToken,
    auth.verifyAdmin,
    categoryController.deleteCategory
);

module.exports = router;
