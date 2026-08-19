const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Helper function to read reviews safely
const getReviewsFromFile = () => {
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading reviews file:', err);
    return [];
  }
};

// Helper function to write reviews safely
const saveReviewsToFile = (reviews) => {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
};

// Socket.io Connection Event
io.on('connection', (socket) => {
  console.log('Manager/Kitchen dashboard connected via Socket.io:', socket.id);

  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

// POST Endpoint: Save 1, 2, and 3-Star Reviews
app.post('/api/reviews', (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    if (rating >= 4) {
      return res.status(400).json({ 
        message: '4 and 5 star reviews should be directed to Google Maps.' 
      });
    }

    if (!rating || !feedback) {
      return res.status(400).json({ message: 'Rating and feedback are required.' });
    }

    const newReview = {
      id: Date.now(),
      name: name || 'Anonymous',
      email: email || 'Not provided',
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };

    // Save locally via fs module
    const currentReviews = getReviewsFromFile();
    currentReviews.unshift(newReview);
    saveReviewsToFile(currentReviews);

    // Emit real-time alert to managers connected via Socket.io
    io.emit('new_low_rating_alert', newReview);

    res.status(201).json({
      success: true,
      message: 'Feedback stored locally and alert dispatched.',
      data: newReview
    });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ success: false, message: 'Server error saving feedback.' });
  }
});

// GET Endpoint: View Stored Feedback
app.get('/api/reviews', (req, res) => {
  const reviews = getReviewsFromFile();
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});