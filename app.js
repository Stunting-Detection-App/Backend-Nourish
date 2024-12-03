const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const journalsRoutes = require('./routes/journalsRoutes');
const profileRoutes = require('./routes/profileRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// Load environment variables
dotenv.config();

app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/journals', journalsRoutes);
app.use('/profile', profileRoutes);
app.use('/predict', predictionRoutes);


// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})