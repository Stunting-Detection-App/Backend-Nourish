const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const journalsRoutes = require('./routes/journalsRoutes');
const profileRoutes = require('./routes/profileRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
}));

// Routes
app.use('/auth', authRoutes);
app.use('/journal', journalsRoutes);
app.use('/profile', profileRoutes);
app.use('/predict', predictionRoutes);
app.use('/nutrition', nutritionRoutes)

app.get('/', (req, res) => {
    res.send('Server is running!');
});
// Start the server

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});