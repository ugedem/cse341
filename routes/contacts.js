const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    const database = client.db('contactsDB');
    return database.collection('contacts');
}

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/', async (req, res) => {
    const contacts = await connectToDatabase();
    const result = await contacts.find().toArray();
    res.json(result);
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: A single contact
 *       404:
 *         description: Contact not found
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contact created successfully
 */
router.post('/', async (req, res) => {
    const contacts = await connectToDatabase();
    const newContact = req.body;

    if (!newContact.firstName || !newContact.lastName || !newContact.email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await contacts.insertOne(newContact);
        res.status(201).json({ message: 'Contact added successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Contact updated successfully
 */
router.put('/:id', async (req, res) => {
    const contacts = await connectToDatabase();
    const id = req.params.id;
    const updatedContact = req.body;

    try {
        const result = await contacts.updateOne({ _id: new ObjectId(id) }, { $set: updatedContact });
        res.status(200).json({ message: 'Contact updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 */
router.delete('/:id', async (req, res) => {
    const contacts = await connectToDatabase();
    const id = req.params.id;

    try {
        const result = await contacts.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Contact deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

module.exports = router;
