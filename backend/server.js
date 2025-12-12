require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const waitlistRoutes = require('./routes/waitlistRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const adminPricingRuleRoutes = require('./routes/adminPricingRuleRoutes');

const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const priceCalculationRoutes = require('./routes/priceCalculationRoutes');

const equipmentRoutes = require('./routes/equipmentRoutes');
const coachRoutes = require('./routes/coachRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', priceCalculationRoutes);
app.use('/api/equipment', equipmentRoutes)
app.use('/api/coaches', coachRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/dashboard', userDashboardRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/rules', adminPricingRuleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
