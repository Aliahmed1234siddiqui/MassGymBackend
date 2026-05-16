require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error-middleware');
const authRoutes = require('./routes/auth-routes');
const memberRoutes = require('./routes/member-routes');
const planRoutes = require('./routes/plan-routes');
const paymentRoutes = require('./routes/payment-routes');
const reportRoutes = require('./routes/report-routes');
const dashboardRoutes = require('./routes/dashboard-routes');
connectDB();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes

// Auth Route
app.use('/api/auth',authRoutes);
app.use('/api/members',   memberRoutes);
app.use('/api/plans',     planRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
