import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import donationRoutes from './routes/donations.js';
import matchingRoutes from './routes/matching.js';
import adminRoutes from './routes/admin.js';
import { initializeDatabase } from './database/init.js';
import { seedDatabase } from './database/seedData.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Initialize database
initializeDatabase();

// Seed database with sample data
seedDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/donations', authenticateToken, donationRoutes);
app.use('/api/matching', authenticateToken, matchingRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});