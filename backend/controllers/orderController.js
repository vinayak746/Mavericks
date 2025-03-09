import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing orders using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing order using Stripe payment gateway
const placeOrderStripe = async (req, res) => {
  // Implementation for Stripe payment
};

// placing order using Razorpay payment gateway
const placeOrderRazorpay = async (req, res) => {
  // Implementation for Razorpay payment
};

// all orders data for Admin Panel
const allOrders = async (req, res) => {
  // Implementation for fetching all orders
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders data for Frontend
const userOrders = async (req, res) => {
  // Implementation for fetching user orders
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  // Implementation for updating order status
  try {
    const { orderId, status } = req.body;
    const dataUpdate = {
      status: status,
      payment: status === "Delivered" ? true : false,
    };
    await orderModel.findByIdAndUpdate(orderId, dataUpdate);
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
