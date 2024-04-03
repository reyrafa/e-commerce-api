const OrderStatus = require("../Models/OrderStatus.js");

const isOrderStatusExisting = (request, response, next) => {
    const statusName = request.body.name;
    OrderStatus.find({ name: new RegExp(statusName, "i") })
        .then((result) => {
            if (result.length > 0) {
                return response.status(400).json({
                    insert: "Failed",
                    message:
                        "Order Status is already Existing. Please Enter another Status",
                });
            }

            next();
        })
        .catch((error) => {
            // console.log(error);
            return response.status(500).json({
                error: "Internal Server error",
                message: "An error occured during oder status insertion.",
            });
        });
};

const addOrderStatus = (request, response) => {
    const reqBody = request.body;

    const newOrderStatus = new OrderStatus({
        name: reqBody.name,
        description: reqBody.description,
    });
    newOrderStatus
        .save()
        .then((result) => {
            return response.status(201).json({
                insert: "Success",
                orderStatus: result,
            });
        })
        .catch((error) => {
            // console.log(error);
            response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during order status insertion.",
            });
        });
};

const fetchOrderStatus = async (request, response) => {
    const orderStatus = await OrderStatus.find({});
    if (!orderStatus) {
        return response.status(404).json({
            fetch: "Failed",
            message: "Order Status not found",
        });
    }

    return response.status(200).json({
        fetch: "Success",
        orderStatus: orderStatus,
    });
};

module.exports = { addOrderStatus, isOrderStatusExisting, fetchOrderStatus };
