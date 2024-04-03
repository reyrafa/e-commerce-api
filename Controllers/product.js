const Product = require("../Models/Product.js");
const Category = require("../Models/Category.js");
const uuid = require("uuid");
// const { response } = require("express");

//check product if it exist on the database
const doesProductExist = (request, response, next) => {
    const reqBody = request.body;
    // console.log(reqBody);
    Product.find({ name: reqBody.name.toLowerCase() })
        .then((result) => {
            // console.log(result);
            if (result.length > 0) {
                return response.status(400).json({
                    insert: "Failed",
                    message:
                        "Product is already existing. Please add another product.",
                });
            }
            next();
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server error",
                message: "An error occured during product insertion.",
            });
        });
};

//function for system generation of SKU
const generateSKU = (category, model, color, name, uniqueID) => {
    return `${category.toUpperCase()}-${model.toUpperCase()}-${color.toUpperCase()}-${name.toUpperCase()}-${uniqueID}`;
};

//function for adding product
const addProduct = (request, response) => {
    const reqBody = request.body;

    Category.findById(reqBody.categoryID)
        .then((result) => {
            const category = result.name;
            const uniqueID = uuid.v4();

            const generatedSKU = generateSKU(
                category,
                reqBody.model,
                reqBody.color,
                reqBody.name,
                uniqueID
            );

            const newProduct = new Product({
                name: reqBody.name.toLowerCase(),
                description: reqBody.description,
                price: reqBody.price,
                model: reqBody.model,
                color: reqBody.color,
                stock: reqBody.stocks,
                images: reqBody.images,
                categoryID: reqBody.categoryID,
                sku: generatedSKU,
            });
            newProduct.save().then((result) => {
                return response.status(201).json({
                    insert: "Success",
                    product: result,
                });
            });
        })
        .catch((error) => {
            // console.log(error);
            response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during product insertion.",
            });
        });
};

//function to fetch all the products
const fetchAllProducts = (request, response) => {
    Product.find()
        .populate("categoryID")
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                products: result,
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An error occured during product fetching.",
            });
        });
};

// function to fetch all the active products
const fetchActiveProducts = (request, response) => {
    Product.find({ isActive: true })
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                products: result,
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during product fetching.",
            });
        });
};

// function to fetch a Single Product
const fetchAProduct = (request, response) => {
    const productId = request.params.productId;
    Product.findById(productId)
        .populate("categoryID")
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                product: result,
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during product fetching",
            });
        });
};

// function to update a Product
const updateProduct = async (request, response) => {
    try {
        const productId = request.params.productId;
        const reqBody = request.body;
        let generatedSKU;
        let categoryName, model, color, name, uniqueID, categoryId;

        let updatedProduct;

        // find the product to be updated
        const product = await Product.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not Found",
            });
        }
        categoryId = reqBody.categoryId
            ? reqBody.categoryId
            : product.categoryID;

        // find the category name to be used for the updated SKU
        const category = await Category.findById(categoryId);
        if (!category) {
            return response.status(404).json({
                message: "Category not Found",
            });
        }
        categoryName = category.name;
        name = reqBody.name ? reqBody.name : product.name;
        model = reqBody.model ? reqBody.model : product.model;
        color = reqBody.color ? reqBody.color : product.color;
        uniqueID = uuid.v4();

        // generating the SKU
        generatedSKU = generateSKU(categoryName, model, color, name, uniqueID);

        const images = product.images;

        // updatedProduct
        updatedProduct = {
            name: name,
            description: reqBody.description,
            model: model,
            color: color,
            price: reqBody.price,
            stock: reqBody.stock,
            categoryID: categoryId,
            sku: generatedSKU,
            images: [reqBody.images, ...images.slice(1)],
        };

        const updatedProductResult = await Product.findByIdAndUpdate(
            productId,
            updatedProduct,
            {
                new: true,
            }
        );

        return response.status(200).json({
            update: "Successful",
            product: updatedProductResult,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            error: "Internal server error",
            message: "Error updating the product.",
        });
    }
};

// function to archive product
const archiveProduct = (request, response) => {
    const productId = request.params.productId;

    Product.findByIdAndUpdate(productId, { isActive: false }, { new: true })
        .then((result) => {
            return response.status(200).json({
                archive: "Success",
                product: {
                    name: result.name,
                    isActive: result.isActive,
                },
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An error occured during product archiving",
            });
        });
};

// activate a product
const activateProduct = (request, response) => {
    const productId = request.params.productId;
    Product.findByIdAndUpdate(productId, { isActive: true }, { new: true })
        .then((result) => {
            return response.status(200).json({
                activation: "Success",
                product: {
                    name: result.name,
                    isActive: result.isActive,
                },
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An error occured during product activation",
            });
        });
};

const fetchProductInACategory = (request, response) => {
    const categoryId = request.params.categoryId;
    Product.find({ categoryID: categoryId })
        .then((result) => {
            return response.status(200).json({
                fetch: "Success",
                products: result,
            });
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server Error",
                message:
                    "An error occured during fetching product in the category",
            });
        });
};

const fetchProductPriceRange = async (request, response) => {
    const maxPrice = request.body.maxPrice;
    const minPrice = request.body.minPrice;
    try {
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
        });
        if (products.length === 0) {
            return response.status(404).json({
                message: "No Product Found",
            });
        }

        return response.status(200).json({
            fetch: "Success",
            products: products,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal Server Error",
            message: "An Error occured during fetching product",
        });
    }
};

const searchProductByName = async (request, response) => {
    const reqBody = request.body;
    try {
        const products = await Product.find({
            name: new RegExp(reqBody.productName, "i"),
        }).populate("categoryID");
        if (products.length === 0) {
            return response.status(404).json({
                message: "No Product Found",
            });
        }
        return response.status(200).json({
            search: "Success",
            product: products,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal Server Error",
            message: "An Error occured during fetching product",
        });
    }
};

module.exports = {
    doesProductExist,
    addProduct,
    fetchAllProducts,
    fetchActiveProducts,
    fetchAProduct,
    updateProduct,
    archiveProduct,
    activateProduct,
    fetchProductInACategory,
    fetchProductPriceRange,
    searchProductByName,
};
