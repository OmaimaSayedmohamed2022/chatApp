const Message = require('../models/messageModel');

const sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    sendMessage 
}
