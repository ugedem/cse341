const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

// ✅ GET all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// ✅ GET a single category by ID
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch category" });
    }
});

// ✅ POST a new category
router.post("/", async (req, res) => {
    try {
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });
    }
});

// ✅ PUT (update) an existing category
router.put("/:id", async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to update category" });
    }
});

// ✅ DELETE a category
router.delete("/:id", async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete category" });
    }
});

// ✅ BULK POST (Create multiple categories)
router.post("/bulk", async (req, res) => {
    try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ error: "An array of categories is required" });
        }
        const newCategories = await Category.insertMany(req.body);
        res.status(201).json(newCategories);
    } catch (error) {
        res.status(500).json({ error: "Failed to create multiple categories" });
    }
});

module.exports = router;
