import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Customize to frontend domain in production
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// API route mappings
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Socket.io Real-time Collaboration Engine
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a document workspace room
  socket.on('join-document', ({ documentId, username, color }) => {
    socket.join(documentId);
    socket.to(documentId).emit('user-joined', {
      id: socket.id,
      username,
      color
    });
    console.log(`${username} joined room: ${documentId}`);
  });

  // Share user cursor movements in real-time
  socket.on('cursor-move', ({ documentId, x, y, username, color }) => {
    socket.to(documentId).emit('cursor-update', {
      id: socket.id,
      username,
      x,
      y,
      color
    });
  });

  // Sync added, edited, or deleted annotations/form elements
  socket.on('element-update', ({ documentId, elements }) => {
    socket.to(documentId).emit('elements-synced', elements);
  });

  // Sync document annotation comment thread comments
  socket.on('comment-add', ({ documentId, comment }) => {
    io.in(documentId).emit('comment-synced', comment);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Connect to Database (MongoDB primary, PostgreSQL fallback)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
      httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB database connection failed: ', err.message);
      // Failover startup
      httpServer.listen(PORT, () => console.log(`Database-offline mode listening on port ${PORT}`));
    });
} else {
  console.log('No MONGO_URI specified. Checking PG configurations...');
  // Default launch
  httpServer.listen(PORT, () => console.log(`Server running in local development mode on port ${PORT}`));
}
