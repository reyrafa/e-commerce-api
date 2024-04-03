const express = require("express");
const paymentStatusController = require("../Controllers/paymentStatus.js");
const auth = require("../auth.js");

const router = express.Router();

router.post(
    "/add-payment-status",
    auth.verifyToken,
    auth.verifyAdmin,
    paymentStatusController.isPaymentStatusExisting,
    paymentStatusController.addPaymentStatus
);

module.exports = router;
