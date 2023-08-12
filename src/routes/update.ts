import express, { Request, Response } from 'express';
import logger from 'loglevel';
import { getSocketFromRequest } from '../utils/socket';
import { getKeyByValue } from '../store';

function getUpdateRoutes() {
    const router = express.Router();
    router.get('/balance', notifyBallanceUpdated);
    return router;
}

async function notifyBallanceUpdated(req: Request, res: Response) {
    const { wallet, balance } = req.query;
    const socket = getSocketFromRequest(req);
    const userSocket = getKeyByValue(wallet as string);

    logger.info(`User ${userSocket} balance updated`);

    socket.to(userSocket).emit('balance-updated', { balance });
    res.send('user notified: ballance updated');
}

export { getUpdateRoutes };
