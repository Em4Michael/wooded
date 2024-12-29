const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', authRoutes);
app.use('/api/properties', propertyRoutes);
// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
