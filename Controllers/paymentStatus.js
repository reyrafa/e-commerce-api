const PaymentStatus = require("../Models/PaymentStatus.js");

const isPaymentStatusExisting = async (request, response, next) => {
    const reqBody = request.body;
    try {
        const paymentStatus = await PaymentStatus.find({
            name: new RegExp(reqBody.statusName, "i"),
        });

        if (paymentStatus.length > 0) {
            return response.status(404).json({
                insert: "Failed",
                message:
                    "Payment Status is already existing. Please input another status.",
            });
        }

        next();
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server error",
        });
    }
};

const addPaymentStatus = async (request, response) => {
    const reqBody = request.body;
    try {
        const newPaymentStatus = new PaymentStatus({
            name: reqBody.statusName,
            description: reqBody.description,
        });
        await newPaymentStatus.save();
        return response.status(201).json({
            insert: "Success",
            paymentStatus: newPaymentStatus,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server error",
        });
    }
};

module.exports = { isPaymentStatusExisting, addPaymentStatus };
