const Payment = require("../Models/Payment.js");
const PaymentStatus = require("../Models/PaymentStatus.js");
const Order = require("../Models/Order.js");
const OrderStatus = require("../Models/OrderStatus.js");

const addPayment = async (request, response) => {
    const reqBody = request.body;
    const userId = request.user.id;
    try {
        // find the pending payment status
        const paymentStatus = await PaymentStatus.findOne({
            name: new RegExp("pending", "i"),
        });

        // payment status not found
        if (!paymentStatus) {
            return response.status(404).json({
                status: "Failed",
                message:
                    "Pending status not found. Please check your payment statuses.",
            });
        }
        const order = await Order.findById(reqBody.orderId);
        if (!order) {
            return response.status(404).json({
                message: "Order not found.",
            });
        }

        const orderStatus = await OrderStatus.findOne({
            name: new RegExp("processing", "i"),
        });

        if (!orderStatus) {
            return response.status(404).json({
                message: "Order status is not found.",
            });
        }

        // check if request amount is exact with the totalamount on order
        if (reqBody.amount != order.totalAmount) {
            return response.status(400).json({
                message: "provided amount is insufficient",
            });
        }

        const newPayment = new Payment({
            orderID: reqBody.orderId,
            userID: userId,
            amount: reqBody.amount,
            paymentMethodID: reqBody.paymentMethodId,
            paymentStatusID: paymentStatus._id,
        });

        // update the status of the paid order
        order.statusID = orderStatus._id;
        order.save();

        await newPayment.save();

        return response.status(201).json({
            status: "Success",
            payment: newPayment,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { addPayment };
