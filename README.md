# BookMyCourt
A full-stack court booking system with user authentication, court scheduling, coach availability, equipment management, dynamic pricing, waitlists, dashboards, and real-time price calculation. Built using React for the frontend and Node.js/Express/MongoDB for the backend.

# Court Booking Backend (Node.js + Express + MongoDB)
This is the backend for a sports court booking system.
The API supports user authentication, court booking, pricing rules, equipment management, coach scheduling, and waitlist handling.
Everything is designed in a modular and easy-to-understand way so it’s simple to extend or integrate with any frontend.

# Features
# User & Auth
Register and login
JWT authentication
Role-based access (user, admin)
Authenticated user profile API

# Courts
Add new courts (admin)
Update or disable courts (admin)
List all active courts

# Coaches
Add coaches with:
expertise
fee
weekly availability
Update coach info
List all coaches

# Equipment
Add equipment types with stock count (admin)
Update stock or name
List equipment (visible to all users)

# Pricing Rules
Create pricing rules (admin)
Time-based dynamic pricing:
weekday / weekend
time ranges
extra charges
court type filters

# Price calculation API for bookings
Booking System
Create booking with:
court
date
time slot
equipment
coach

# Modify booking (time, court, equipment, coach)

# Cancel booking

# Automatic price recalculation

#Waitlist
Join waitlist if slot is full
Prevent duplicate waitlist entries
Set maximum waitlist length per slot
Auto-book next user when a booking is cancelled

# Dashboards
User Dashboard: upcoming, past, cancelled bookings, and waitlist status
Admin Dashboard: all system-wide bookings, stats, waitlist, cancellations

# Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT for authentication
bcrypt for password hashing
dotenv for configuration

# Setup

# Environment Variables
Create a .env file:

PORT=5000
MONGO_URI=your_connection_string

# Installation & Setup
npm install
npm start
npm run dev or npm start

# API Overview
  # Auth
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/profile

  # Courts
  GET  /api/courts
  POST /api/courts (admin)
  PUT  /api/courts/admin/:id (admin)
  PUT  /api/courts/admin/disable/:id (admin)

  # Coaches
  GET  /api/coaches
  POST /api/coaches (admin)
  PUT  /api/coaches/:id (admin)

  # Equipment
  GET  /api/equipment
  POST /api/equipment (admin)
  PUT  /api/equipment/:id (admin)

  # Pricing Rules
  GET  /api/rules (admin)
  POST /api/rules (admin)
  PUT  /api/rules/:id (admin)

  # Price Calculation
  POST /api/pricing/calculate

  # Bookings
  POST /api/bookings
  GET  /api/bookings/me
  PUT  /api/bookings/update/:id
  PUT  /api/bookings/cancel/:id
  POST /api/bookings/waitlist

  # Dashboards
  GET /api/dashboard (user)
  GET /api/admin/dashboard (admin)
