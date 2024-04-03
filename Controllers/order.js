const Order = require("../Models/Order.js");
const OrderItem = require("../Models/OrderItem.js");
const OrderStatus = require("../Models/OrderStatus.js");
const Product = require("../Models/Product.js");

const checkIfProductHasStock = async (request, response, next) => {
    const reqBody = request.body;
    let product = await Product.findById(reqBody.productId);

    let stock = product.stock - reqBody.quantity;

    // stock is less than 0
    if (stock < 0) {
        return response.status(400).json({
            addToCart: "Failed",
            message: "Insufficient stock for the requested quantity",
        });
    }
    next();
};

// validation: checking product if it is active or not
const isProductActive = async (request, response, next) => {
    const reqBody = request.body;
    let product = await Product.findById(reqBody.productId);
    if (product.isActive == false) {
        return response.status(400).json({
            addToCart: "Failed",
            message: "Product is not active",
        });
    }
    next();
};

const addToCart = async (request, response) => {
    try {
        const userId = request.user.id;
        const reqBody = request.body;
        let totalAmount = 0;

        //for finding the order with pending payment
        let orderStatus = await OrderStatus.findOne({
            name: "Pending Payment",
        });
        if (!orderStatus) {
            return response.status(404).json({
                message: "Pending Payment Status not found",
            });
        }

        // find the product
        let product = await Product.findById(reqBody.productId);
        if (!product) {
            return response.status(404).json({ message: "Product not found" });
        }

        // order is still pending
        let order = await Order.findOne({
            statusID: orderStatus._id,
            userID: userId,
        });

        // order not payed
        if (!order) {
            order = new Order({
                userID: userId,
                totalAmount: totalAmount,
                statusID: orderStatus._id,
            });
        }

        // already add to cart the product
        let orderItem = await OrderItem.findOne({
            orderID: order._id,
            productID: product._id,
        });

        let newOrderItem = !orderItem
            ? new OrderItem({
                  orderID: order._id,
                  productID: product._id,
                  quantity: reqBody.quantity,
                  subTotal: product.price * reqBody.quantity,
              })
            : orderItem;

        if (orderItem) {
            product.stock += newOrderItem.quantity;
            order.totalAmount -= newOrderItem.subTotal;

            let newSubtotal =
                orderItem.subTotal + product.price * reqBody.quantity;

            newOrderItem.quantity = newOrderItem.quantity + reqBody.quantity;
            newOrderItem.subTotal = newSubtotal;
        }
        await newOrderItem.save();

        // updating the total amount on the order collection
        order.totalAmount += newOrderItem.subTotal;
        await order.save();

        // update the product stock base on the quantity ordered
        product.stock -= newOrderItem.quantity;
        await product.save();

        return response.status(201).json({
            message: "Item added to cart successfully",
            OrderItem: newOrderItem,
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// fetch pending orders
const pendingOrders = async (request, response) => {
    const userId = request.user.id;

    try {
        // fetching the pending payment, id will be use on the condition on fetching order
        const orderStatus = await OrderStatus.findOne({
            name: "Pending Payment",
        });
        if (!orderStatus) {
            return response.status(404).json({
                message: "Pending Payment Status not found",
            });
        }

        // fetching the order of the user
        const order = await Order.findOne({
            userID: userId,
            statusID: orderStatus._id,
        });
        if (!order) {
            return response.status(404).json({
                message: "Order not found",
            });
        }

        // fetching the order item of the order
        const orderItems = await OrderItem.find({
            orderID: order._id,
        });

        if (!orderItems || orderItems.length === 0) {
            return response.status(404).json({
                message: "Order Item not found",
            });
        }

        //geting the product id from order items
        const productIds = orderItems.map((item) => item.productID);

        // product fetched
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products || products.length === 0) {
            return response.status(404).json({
                message: "No products found for the given order items",
            });
        }

        // attach the product with its order item
        const orderItemWithProduct = orderItems.map((orderItem) => {
            const associatedProduct = products.find((product) =>
                product._id.equals(orderItem.productID)
            );
            return {
                item: {
                    orderItem,
                    associatedProduct,
                },
            };
        });

        return response.status(200).json({
            fetch: "Sucess",
            order: order,
            Cart: orderItemWithProduct,
        });
    } catch (error) {
        // console.log(error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// fetch order History with status filter
const orderHistory = async (request, response) => {
    const orderStatusId = request.params.orderStatusId;
    const userId = request.user.id;
    try {
        const order = await Order.find({
            userID: userId,
            statusID: orderStatusId,
        });

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
            });
        }
        return response.status(200).json({
            fetch: "Success",
            order: order,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server Error",
        });
    }
};

// fetch all orders : admin only
const retrieveOrders = async (request, response) => {
    try {
        const orders = await Order.find({});
        if (!orders || orders.length === 0) {
            return response.status(404).json({
                message: "No order Found",
            });
        }

        return response.status(200).json({
            fetch: "Success",
            orders: orders,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server Error",
        });
    }
};

// change order's product quantity
const updateOrderProductQuantity = async (request, response) => {
    const reqBody = request.body;
    try {
        if (reqBody.quantity <= 0) {
            return response.status(400).json({
                update: "Failed",
                message: "Quantity should be greater than 0",
            });
        }
        let order = await Order.findById(reqBody.orderId);
        if (!order) {
            return response.status(404).json({
                message: "No order Found",
            });
        }

        let product = await Product.findById(reqBody.productId);
        if (!product) {
            return response.status(404).json({
                message: "No product Found",
            });
        }

        let orderItem = await OrderItem.findById(reqBody.orderItemId);
        if (!orderItem) {
            return response.status(404).json({
                message: "No order Item Found",
            });
        }
        let oldSubTotal = orderItem.subTotal;
        orderItem.subTotal = product.price * reqBody.quantity;
        product.stock += orderItem.quantity - reqBody.quantity;

        if (product.stock < 0) {
            return response.status(400).json({
                update: "Failed",
                message: "Insufficient stock for the requested quantity",
            });
        }
        order.totalAmount -= oldSubTotal;
        order.totalAmount += orderItem.subTotal;

        await orderItem.save();
        await product.save();
        await order.save();

        const updatedProductQuantity = {
            quantity: reqBody.quantity,
            subTotal: orderItem.subTotal,
        };
        const updatedOrderItem = await OrderItem.findByIdAndUpdate(
            reqBody.orderItemId,
            updatedProductQuantity,
            { new: true }
        );
        return response.status(200).json({
            update: "Success",
            order: order,
            OrderItem: updatedOrderItem,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server error",
        });
    }
};

// remove product from cart
const removeProductFromCart = async (request, response) => {
    const reqBody = request.body;
    try {
        let order = await Order.findById(reqBody.orderId);
        if (!order) {
            return response.status(404).json({
                message: "No order Found",
            });
        }

        let product = await Product.findById(reqBody.productId);
        if (!product) {
            return response.status(404).json({
                message: "No product Found",
            });
        }

        let orderItem = await OrderItem.findById(reqBody.orderItemId);
        if (!orderItem) {
            return response.status(404).json({
                message: "No order Item Found",
            });
        }

        // update the stock of the product
        product.stock += orderItem.quantity;
        // update the total amount on the order
        order.totalAmount -= orderItem.subTotal;

        await product.save();
        await order.save();

        const deletedOrderItem = await OrderItem.findByIdAndDelete(
            orderItem._id
        );

        return response.status(200).json({
            delete: "Success",
            order: order,
        });
    } catch (error) {
        // console.log(error);
        return response.status(500).json({
            error: "Internal server error",
        });
    }
};

// fetch a single Order List
const fetchASingleOrderList = async (request, response) => {
    const orderItemId = request.params.orderItemId;
    try {
        let orderItem = await OrderItem.findById(orderItemId);
        if (!orderItem) {
            return response.status(404).json({
                message: "No Order Item Found",
            });
        }
        return response.status(200).json({
            fetch: "Success",
            orderItem: orderItem,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const fetchOrderLists = async (request, response) => {
    try {
        const orderId = request.params.orderId;
        const orderLists = await OrderItem.find({
            orderID: orderId,
        }).populate("productID");

        if (!orderLists) {
            return response.status(404).json({
                fetch: "Failed",
                message: "Order Lists not found.",
            });
        }
        return response.status(200).json({
            fetch: "Success",
            orderLists: orderLists,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    addToCart,
    checkIfProductHasStock,
    isProductActive,
    pendingOrders,
    orderHistory,
    retrieveOrders,
    updateOrderProductQuantity,
    removeProductFromCart,
    fetchASingleOrderList,
    fetchOrderLists,
};
