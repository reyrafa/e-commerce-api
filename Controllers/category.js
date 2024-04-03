const Category = require("../Models/Category.js");

const doesCategoryExist = (request, response, next) => {
    const reqBody = request.body;

    Category.find({ name: reqBody.name.toLowerCase() })
        .then((result) => {
            if (result.length > 0) {
                return response.status(400).json({
                    insert: "Failed",
                    message:
                        "Category already exist! Please Enter another category.",
                });
            }
            next();
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An error occured during category validation.",
            });
        });
};

const addCategory = (request, response) => {
    const reqBody = request.body;
    const newCategory = new Category({
        name: reqBody.name.toLowerCase(),
        description: reqBody.description,
    });

    newCategory
        .save()
        .then((result) => {
            return response.status(201).json({
                insert: "Category is added Successfully!",
                category: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during category creation.",
            });
        });
};

// provide name and description(optional) to be updated
const updateCategory = (request, response) => {
    const reqBody = request.body;
    const id = request.params.id;
    const updatedCategory = {
        name: reqBody.name ? reqBody.name.toLowerCase() : undefined,
        description: reqBody.description,
    };
    Category.findByIdAndUpdate(id, updatedCategory, { new: true })
        .then((result) => {
            return response.status(200).json({
                update: "Category is updated Successfully!",
                category: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during updating category.",
            });
        });
};

//fetch all categories
const fetchCategories = (request, response) => {
    Category.find({})
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                category: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during fetching all categories.",
            });
        });
};

const fetchSingleCategory = (request, response) => {
    const id = request.params.id;
    Category.findById(id)
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                category: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during fetching category.",
            });
        });
};

const deleteCategory = (request, response) => {
    const id = request.params.id;

    Category.findByIdAndDelete(id)
        .then((result) => {
            return response.status(200).json({
                delete: "Success",
                message: "Category deleted Successfully!",
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during category deletion.",
            });
        });
};
module.exports = {
    doesCategoryExist,
    addCategory,
    updateCategory,
    fetchCategories,
    fetchSingleCategory,
    deleteCategory,
};
