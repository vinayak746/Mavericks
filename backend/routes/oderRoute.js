import express from "express";
import { allOrders, userOrders, updateStatus,placeOrderRazorpay,placeOrderStripe,placeOrder } from "../controllers/orderController.js";
import  adminAuth  from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js"
const orderRouter = express.Router();


// Admin Features
orderRouter.post("/list", adminAuth ,allOrders);
orderRouter.post("/status", adminAuth ,updateStatus);

// payment features
orderRouter.post("/place",authUser,placeOrder);
orderRouter.post("/stripe",authUser,placeOrderStripe);
orderRouter.post("/razorpay",authUser,placeOrderRazorpay);

// User Features
orderRouter.post("/userorders",authUser,userOrders);

export default orderRouter;