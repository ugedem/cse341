const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');

// Create a new item
router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Name, description, and price are required' });
        }

        const item = new Item({ name, description, price });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// 🚀 Bulk Item Creation
router.post('/bulk', async (req, res) => {
    try {
        const items = req.body;

        // Ensure data is an array and not empty
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array.' });
        }

        // Validate each item in the array
        const invalidItems = items.filter(item => 
            !item.name || !item.description || !item.price
        );

        if (invalidItems.length > 0) {
            return res.status(400).json({ 
                error: 'Each item must have a name, description, and price.',
                invalidItems 
            });
        }

        // Insert valid items into the database
        const createdItems = await Item.insertMany(items);
        res.status(201).json({
            message: 'Items created successfully',
            createdItems
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create items in bulk' });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// Update an item
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
