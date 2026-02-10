const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminMiddleware");


const protect = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders
} = require("../controllers/orderController");

// create new order (protected)
router.post("/", protect, createOrder);

// get logged-in user's orders (protected)
router.get("/", protect, getMyOrders);

// update order status (protected)
router.put("/:id", protect, updateOrderStatus);

// update order status (protected, admin only)
router.put("/:id", protect, adminOnly, updateOrderStatus);

// delete order (protected, admin only)
router.delete("/:id", protect, adminOnly, deleteOrder);

// get all orders (protected, admin only)
router.get("/all", protect, adminOnly, getAllOrders);




module.exports = router;
