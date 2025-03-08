const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Corrected variable name
const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    const database = client.db('contactsDB');
    return database.collection('contacts');
}

// GET all contacts
router.get('/', async (req, res) => {
    const contacts = await connectToDatabase();
    const result = await contacts.find().toArray();
    res.json(result);
});

// GET contact by ID
router.get('/:id', async (req, res) => {
    const contacts = await connectToDatabase();
    const id = req.params.id;

    try {
        const result = await contacts.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return res.status(404).send('Contact not found');
        }
        res.json(result);
    } catch (error) {
        res.status(500).send('Invalid ID format');
    }
});

// POST new contact (Added this part)
router.post('/', async (req, res) => {
    const contacts = await connectToDatabase();
    const newContact = req.body;

    if (!newContact.name || !newContact.email || !newContact.phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    try {
        const result = await contacts.insertOne(newContact);
        res.status(201).json({ message: 'Contact added successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

module.exports = router;
