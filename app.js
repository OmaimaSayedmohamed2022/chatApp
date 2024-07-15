const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createChatRoutes = require('./router/chatRouter');
const authRoutes = require('./router/userRouter');
const socketController = require('./controller/socketController');
const { join } = require('path');

dotenv.config();


const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const mongoUrl = process.env.dbUrl;

app.use(express.json());

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/auth', authRoutes);


const chatRoutes = createChatRoutes(io);
app.use('/chat', chatRoutes);
socketController(io);


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
