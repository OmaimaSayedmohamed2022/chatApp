

const express = require('express');
const chatController = require('../controller/chatController');

const createRouter = (io) => {
    const router = express.Router();

    router.post('/messages', chatController.sendMessage);

    return router;
};

module.exports = createRouter;

