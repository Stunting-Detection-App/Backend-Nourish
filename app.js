const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const app = express();

// Load environment variables
dotenv.config();

app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors());

// Routes

app.use('/api/auth', authRoutes); // All auth routes go here

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});