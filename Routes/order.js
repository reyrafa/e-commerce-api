const express = require("express");

const router = express.Router();
const auth = require("../auth.js");
const orderController = require("../Controllers/order.js");

// add an order
router.post(
    "/add-to-cart",
    auth.verifyToken,
    orderController.checkIfProductHasStock,
    orderController.isProductActive,
    orderController.addToCart
);

// retrieve user's pending orders
router.get("/pending-orders", auth.verifyToken, orderController.pendingOrders);

// retrive order history with status filter as params
router.get(
    "/order-history/:orderStatusId",
    auth.verifyToken,
    orderController.orderHistory
);

// fetch all orders : admin only
router.get(
    "/retrieve-orders",
    auth.verifyToken,
    auth.verifyAdmin,
    orderController.retrieveOrders
);

// change order's product quantities
router.put(
    "/update-order-product-quantity",
    auth.verifyToken,
    orderController.updateOrderProductQuantity
);

// fetch a single order item
router.get(
    "/fetch-order-item/:orderItemId",
    auth.verifyToken,
    orderController.fetchASingleOrderList
);

// remove product to cart
router.delete(
    "/remove-product-from-cart",
    auth.verifyToken,
    orderController.removeProductFromCart
);

//fetch order Items in that order done by user
router.get(
    "/order-items/:orderId",
    auth.verifyToken,
    orderController.fetchOrderLists
);
module.exports = router;
