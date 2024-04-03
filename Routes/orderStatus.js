const express = require("express");
const orderStatusController = require("../Controllers/orderStatus.js");
const router = express.Router();
const auth = require("../auth.js");

// add order status
router.post(
    "/add-orderStatus",
    auth.verifyToken,
    auth.verifyAdmin,
    orderStatusController.isOrderStatusExisting,
    orderStatusController.addOrderStatus
);

//fetch order status
router.get(
    "/fetch-orderStatus",
    auth.verifyToken,
    orderStatusController.fetchOrderStatus
);

module.exports = router;
