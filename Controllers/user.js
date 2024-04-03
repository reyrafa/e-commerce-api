const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const router = require("../Routes/order.js");
const Order = require("../Models/Order.js");

// for checking email if already registered
const isEmailExisting = (request, response, next) => {
    const reqBody = request.body;

    User.find({ email: reqBody.email })
        .then((result) => {
            if (result.length > 0) {
                return response.status(400).json({
                    insert: "Failed",
                    message:
                        "Email is already registered! Please use another Email",
                });
            } else {
                next();
            }
        })
        .catch((error) => response.send(error));
};

// for registering new User
const registerUser = (request, response) => {
    const reqBody = request.body;
    const newUser = new User({
        email: reqBody.email,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        password: bcrypt.hashSync(reqBody.password, 10),
        mobileNumber: reqBody.mobileNumber,
    });

    newUser
        .save()
        .then((result) => {
            result.password = "";
            return response.status(201).json({
                insert: "User is registered Successfully!",
                user: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal Server Error",
                message: "An Error occured during user registration",
            });
        });
};

//for user authentication
const loginUser = (request, response) => {
    const reqBody = request.body;
    User.findOne({ email: reqBody.email })
        .then((result) => {
            if (!result) {
                return response.status(404).json({
                    login: "Failed",
                    message:
                        "Email does not exist. Register first before logging in.",
                });
            }
            const isPasswordCorrect = bcrypt.compareSync(
                reqBody.password,
                result.password
            );
            if (!isPasswordCorrect) {
                return response.status(401).json({
                    login: "Failed",
                    message: "You Provided a wrong password. Please try again.",
                });
            }
            const token = auth.createAccessToken(result);
            return response.status(200).json({
                login: "Login Successful.",
                accessToken: token,
            });
        })
        .catch((error) => {
            // console.log("Error details:", error.message);
            return response.status(500).json({
                error: "Internal server error",
                message: "An error occurred during authentication.",
            });
        });
};

const fetchUserDetails = (request, response) => {
    User.findById(request.user.id)
        .then((result) => {
            result.password = "";
            return response.status(200).json({
                fetch: "Fetch successfully",
                user: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal server error",
                message: "An error occurred during authentication.",
            });
        });
};

const verifyEmail = (request, response) => {
    User.findByIdAndUpdate(
        request.user.id,
        {
            emailVerifiedDate: new Date(),
        },
        { new: true }
    )
        .then((result) => {
            const token = auth.createAccessToken(result);
            // console.log(request.user);
            result.password = "";
            return response.status(200).json({
                verification: "Email Verified Successfully!",
                user: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal server error",
                message: "An error occured during email verification.",
            });
        });
};

const updateUserInfo = async (request, response) => {
    const reqBody = request.body;

    const updatedUser = {
        email: reqBody.email,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        password: reqBody.password
            ? bcrypt.hashSync(reqBody.password, 10)
            : undefined,
        mobileNumber: reqBody.mobileNumber,
    };

    const findEmail = await User.find({ email: reqBody.email });
    if (findEmail.length > 0 && findEmail[0]._id != request.user.id) {
        return response.status(400).json({
            update: "Failed",
            message: "Email is already Taken. Please enter another one.",
        });
    }

    User.findByIdAndUpdate(request.user.id, updatedUser, { new: true })
        .then((result) => {
            result.password = "";
            return response.status(200).json({
                update: "Profile Updated Successfully!",
                user: result,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal server error",
                message: "An error occur during User update.",
            });
        });
};

const updateToAdmin = (request, response) => {
    const userId = request.params.userId;

    User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
        .then((result) => {
            return response.status(200).json({
                update: "Success",
                users: {
                    email: result.email,
                    isAdmin: result.isAdmin,
                },
            });
        })
        .catch((error) => {
            return response.status(500).json({
                error: "Internal server error",
                message: "An error occur during User update.",
            });
        });
};

const fetchUsers = async (request, response) => {
    try {
        const user = await User.find({});

        if (!user) {
            return response.status(404).json({
                fetch: "Failed",
                message: "No Record!",
            });
        }

        return response.status(200).json({
            fetch: "Success",
            user: user,
        });
    } catch (error) {
        return response.status(500).json({
            error: "Internal server error",
            message: "An error occur during user fetching.",
        });
    }
};

// fetch user's orders
const fetchUserOrder = async (request, response) => {
    try {
        const reqBody = request.body;
        const userOrder = await Order.find({ userID: reqBody.userId });
        if (!userOrder) {
            return response.status.json({
                fetch: "Not Found",
                message: "No order yet",
            });
        }
        return response.status(200).json({
            fetch: "Success",
            userOrder: userOrder,
        });
    } catch (error) {
        return response.status(500).json({
            error: "Internal server error",
            message: "An error occur during order fetching.",
        });
    }
};
module.exports = {
    isEmailExisting,
    registerUser,
    loginUser,
    fetchUserDetails,
    verifyEmail,
    updateUserInfo,
    updateToAdmin,
    fetchUsers,
    fetchUserOrder,
};
