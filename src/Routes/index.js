const express = require('express');
const UserService = require('../Services/userService');
const UserController = require('../Controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const OrderService = require('../Services/orderService');
const OrderController = require('../Controllers/orderController');
const permission = require('../middlewares/permission');
const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

const orderService = new OrderService();
const orderController = new OrderController(orderService);
// User registration route
router.post('/auth/register',verifyToken, permission('admin'),userController.createUser.bind(userController));

// User login route
router.post('/auth/login', userController.loginUser.bind(userController));

// User profile route (protected)
router.get('/auth/me',verifyToken, userController.getUserProfile.bind(userController));


//order and payment routes
router.post("/payments/checkout", orderController.createOrder.bind(orderController));
router.get("/success", orderController.paymentSuccess.bind(orderController));
module.exports = router;
