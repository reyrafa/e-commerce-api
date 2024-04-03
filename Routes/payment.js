const express = require("express");
const auth = require("../auth.js");
const paymentController = require("../Controllers/payment.js");

const router = express.Router();

router.post("/add-payment", auth.verifyToken, paymentController.addPayment);

module.exports = router;
