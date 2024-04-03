const express = require("express");

const router = express.Router();

const productController = require("../Controllers/product.js");

const auth = require("../auth.js");

// add product
router.post(
    "/add-product",
    auth.verifyToken,
    auth.verifyAdmin,
    productController.doesProductExist,
    productController.addProduct
);

//fetch all products
router.get(
    "/products-list",
    auth.verifyToken,
    auth.verifyAdmin,
    productController.fetchAllProducts
);

//fetch all active products
router.get("/active-products", productController.fetchActiveProducts);

// fetch a single product
router.get("/fetch-product/:productId", productController.fetchAProduct);

// update a product
router.put(
    "/update-product/:productId",
    auth.verifyToken,
    auth.verifyAdmin,
    productController.updateProduct
);

// archive product
router.put(
    "/archive-product/:productId",
    auth.verifyToken,
    auth.verifyAdmin,
    productController.archiveProduct
);

// activate product
router.put(
    "/activate-product/:productId",
    auth.verifyToken,
    auth.verifyAdmin,
    productController.activateProduct
);

// fetch products in that category
router.get(
    "/fetch-products-in-category/:categoryId",
    productController.fetchProductInACategory
);

// fetch product within the price range
router.post(
    "/fetch-products-price-range",
    productController.fetchProductPriceRange
);

router.post("/search-product", productController.searchProductByName);
module.exports = router;
