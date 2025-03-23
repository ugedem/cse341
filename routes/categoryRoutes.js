const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// 🚀 Bulk Category Creation
router.post('/bulk', async (req, res) => {
    try {
        const categories = req.body;

        // Ensure data is an array and not empty
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array.' });
        }

        // Validate each category in the array
        const invalidCategories = categories.filter(category => 
            !category.name || !category.description
        );

        if (invalidCategories.length > 0) {
            return res.status(400).json({
                error: 'Each category must have a name and description.',
                invalidCategories
            });
        }

        // Insert valid categories into the database
        const createdCategories = await Category.insertMany(categories);
        res.status(201).json({
            message: 'Categories created successfully',
            createdCategories
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create categories in bulk' });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
