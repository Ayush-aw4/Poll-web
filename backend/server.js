const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const { errorHandler } = require('./middleware/errorHandler');


dotenv.config();

connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use(cors({
  origin: "https://poll-web.vercel.app",
  credentials: true
}));

// 404 handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});