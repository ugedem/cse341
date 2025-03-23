const Item = require('../models/itemModel');

// GET all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
};

// GET single item
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve item' });
    }
};

// POST new item (Single or Bulk)
exports.createItem = async (req, res) => {
    const data = req.body;

    if (Array.isArray(data)) {
        // Bulk Insertion
        if (data.some(item => !item.name || !item.description || !item.price)) {
            return res.status(400).json({ error: 'Each item must have name, description, and price' });
        }

        try {
            const newItems = await Item.insertMany(data);
            res.status(201).json({
                message: `${newItems.length} item(s) created successfully`,
                items: newItems
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create items', details: error.message });
        }
    } else {
        // Single Insertion
        const { name, description, price } = data;
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const newItem = new Item({ name, description, price });
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create item', details: error.message });
        }
    }
};

// PUT (update) item
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
};

// DELETE item
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
