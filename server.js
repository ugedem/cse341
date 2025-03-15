const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Ensure this is imported at the top

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Contacts API',
            version: '1.0.0',
            description: 'API for managing contacts',
            contact: {
                name: 'Aaron Edem',
                email: 'aaronedem17@gmail.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: `https://contacts-api-k0dw.onrender.com/`,
                description: 'Production Server'
            },
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(express.json());

// Route handling
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Import and use contacts routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
