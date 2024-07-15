const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');

const socketController = (io) => {
    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.userId = decoded.userId;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', (socket) => {
        console.log('User connected:', socket.userId);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.userId);
        });

        socket.on('private message', async (receiverId, content) => {
            const newMessage = new Message({ sender: socket.userId, receiver: receiverId, content });
            await newMessage.save();
            socket.emit('private message', newMessage);
            socket.to(receiverId).emit('private message', newMessage); // Send to specific user
        });
    });
};

module.exports = socketController;

