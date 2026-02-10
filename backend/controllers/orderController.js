const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item"
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        message: "Total amount must be greater than zero"
      });
    }

    const order = await Order.create({
        user: req.user,
        items,
        totalAmount,
        history: [{ status: "Pending" }]
    });


    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user }).populate("user", "name email");
    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // allowed status values
    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered"
    ];

    // validation
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;
    order.history.push({ status });
    await order.save();

    res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders
};
