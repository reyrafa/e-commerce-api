const express = require("express");

const userController = require("../Controllers/user.js");

const auth = require("../auth.js");

const router = express.Router();

// route for registering new User
router.post(
    "/register",
    userController.isEmailExisting,
    userController.registerUser
);

// route for authenticating user
router.post("/login", userController.loginUser);

// route for fetching user data
router.get("/details", auth.verifyToken, userController.fetchUserDetails);

//route for verifying email
router.patch("/verify-email", auth.verifyToken, userController.verifyEmail);

// route for updating user information
router.put("/update-info", auth.verifyToken, userController.updateUserInfo);

// route to update user to admin
router.put(
    "/update-to-admin/:userId",
    auth.verifyToken,
    auth.verifyAdmin,
    userController.updateToAdmin
);

// fetch users
router.get(
    "/fetch-users",
    auth.verifyToken,
    auth.verifyAdmin,
    userController.fetchUsers
);
// fetch user orders
router.post(
    "/orders",
    auth.verifyToken,
    auth.verifyAdmin,
    userController.fetchUserOrder
);
module.exports = router;
