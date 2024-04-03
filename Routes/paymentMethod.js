const express = require("express");
const auth = require("../auth.js");
const paymentMethodController = require("../Controllers/paymentMethod.js");

const router = express.Router();

router.post(
    "/add-payment-method",
    auth.verifyToken,
    auth.verifyAdmin,
    paymentMethodController.isPaymentMethodExisting,
    paymentMethodController.addPaymentMethod
);

router.put(
    "/update-payment-method/:paymentMethodId",
    auth.verifyToken,
    auth.verifyAdmin,
    paymentMethodController.updatePaymentMethod
);

// fetch all payment methods
router.get(
    "/payment-methods",
    auth.verifyToken,
    paymentMethodController.fetchPaymentMethods
);
module.exports = router;
