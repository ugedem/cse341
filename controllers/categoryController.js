const Category = require('../models/categoryModel');

// GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
};

// GET single category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
};

// POST new category (Single or Bulk)
exports.createCategory = async (req, res) => {
    const data = req.body;

    if (Array.isArray(data)) {
        // Bulk Insertion
        if (data.some(cat => !cat.name || !cat.description)) {
            return res.status(400).json({ error: 'Each category must have a name and description' });
        }

        try {
            const newCategories = await Category.insertMany(data);
            res.status(201).json({
                message: `${newCategories.length} category(ies) created successfully`,
                categories: newCategories
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create categories', details: error.message });
        }
    } else {
        // Single Insertion
        const { name, description } = data;
        if (!name || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const newCategory = new Category({ name, description });
            await newCategory.save();
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create category', details: error.message });
        }
    }
};

// PUT (update) category
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
