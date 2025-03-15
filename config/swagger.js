const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Contacts API',
            version: '1.0.0',
            description: 'API for managing contacts',
            contact: {
                name: 'Aaron Edem',
                email: 'aaronedem17@gmail.com',
                url: 'https://github.com/ugedem' 
            },
            license: {
                name: 'MIT & Open Source',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'https://contacts-api-k0dw.onrender.com', 
                description: 'Production Server'
            }
        ],
        components: {
            schemas: {
                Contact: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email'],
                    properties: {
                        _id: { type: 'string', description: 'Auto-generated ID of the contact' },
                        firstName: { type: 'string', description: 'First name of the contact' },
                        lastName: { type: 'string', description: 'Last name of the contact' },
                        email: { type: 'string', description: 'Email address of the contact' },
                        phone: { type: 'string', description: 'Phone number of the contact' },
                        favoriteColor: { type: 'string', description: 'Favorite color of the contact' },
                        birthday: { type: 'string', format: 'date', description: 'Birthday of the contact' }
                    },
                    example: {
                        firstName: 'Precious',
                        lastName: 'Aaron',
                        email: 'precious.aaron@gmail.com',
                        phone: '+2347084006136',
                        favoriteColor: 'Blue',
                        birthday: '1995-08-12'
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {

    // CORS headers for Swagger
    app.use('/api-docs', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
    console.log(`Swagger documentation available at https://contacts-api-k0dw.onrender.com/api-docs`);
};

module.exports = swaggerDocs;
