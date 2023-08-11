import express from 'express';
import logger from 'loglevel';
import { getSocketFromRequest } from '../utils/socket.js';

function getUpdateRoutes() {
    const router = express.Router();
    router.get('/ballance', notifyBallanceUpdated);
    return router;
}

async function notifyBallanceUpdated(req, res) {
    logger.info('updtae ballance');
    // equity wallet main server call this api to notify ballance updated syncronously (no need to wait for response)
    // then this api will notify all connected clients via socket.io
    const socket = getSocketFromRequest(req);
    socket.emit('ballanceUpdated', { ballance: 1000 });
    res.send('api update ballance');
}

export { getUpdateRoutes };
