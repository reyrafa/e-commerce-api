const PaymentMethod = require("../Models/PaymentMethod.js");

const isPaymentMethodExisting = async (request, response, next) => {
    const reqBody = request.body;
    try {
        const paymentMethod = await PaymentMethod.find({
            name: new RegExp(reqBody.name, "i"),
        });
        if (paymentMethod.length > 0) {
            return response.status(400).json({
                insert: "Failed",
                message:
                    "Payment Method is already Existing. Please Enter another method",
            });
        }
        next();
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            insert: "Failed",
            message: "Internal Server Error",
        });
    }
};

const addPaymentMethod = async (request, response) => {
    const reqBody = request.body;
    try {
        const newPaymentMethod = new PaymentMethod({
            name: reqBody.name,
            description: reqBody.description,
        });
        await newPaymentMethod.save();
        return response.status(201).json({
            insert: "Success",
            message: "Payment Method added successfully.",
            paymentMethod: newPaymentMethod,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            insert: "Failed",
            message: "Internal Server Error",
        });
    }
};

const updatePaymentMethod = async (request, response) => {
    const reqBody = request.body;
    const paymentMethodId = request.params.paymentMethodId;
    try {
        const updatedPaymentMethod = {
            name: reqBody.name,
            description: reqBody.description,
        };
        const successUpdatePaymentMethod =
            await PaymentMethod.findByIdAndUpdate(
                paymentMethodId,
                updatedPaymentMethod,
                { new: true }
            );

        if (!successUpdatePaymentMethod) {
            return response.status(400).json({
                update: "fail",
                message: "Payment Method is not updated!",
            });
        }

        return response.status(200).json({
            update: "Success",
            paymentMethod: successUpdatePaymentMethod,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            update: "Failed",
            message: "Internal Server Error",
        });
    }
};

const fetchPaymentMethods = async (request, response) => {
    const paymentMethods = await PaymentMethod.find({});
    if (!paymentMethods) {
        return response.status(404).json({
            message: "No Payment Method registered. Please register one",
        });
    }
    return response.status(200).json({
        fetch: "success",
        paymentMethods: paymentMethods
    })
};
module.exports = {
    addPaymentMethod,
    isPaymentMethodExisting,
    updatePaymentMethod,
    fetchPaymentMethods,
};
