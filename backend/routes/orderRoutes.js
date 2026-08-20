import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route  POST /api/orders  (create order from cart)
router.post("/", protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let itemsPrice = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(404).json({ message: `Product ${it.product} not found` });
      if (product.stock < it.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      itemsPrice += product.price * it.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: it.quantity,
      });
      product.stock -= it.quantity;
      await product.save();
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/my
router.get("/my", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/:id
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders  (admin: all orders)
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/orders/:id/status  (admin only)
router.put("/:id/status", protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status || order.status;
    if (order.status === "Delivered") order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
