import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/products?keyword=&category=&page=
router.get("/", async (req, res, next) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...category };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/products/categories
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/products  (admin only)
router.post("/", protect, admin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/products/:id  (admin only)
router.put("/:id", protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/products/:id  (admin only)
router.delete("/:id", protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
});

export default router;
