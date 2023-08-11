import express, { Request, Response } from 'express';
import logger from 'loglevel';
import { getSocketFromRequest } from '../utils/socket';

function getUpdateRoutes() {
    const router = express.Router();
    router.get('/ballance', notifyBallanceUpdated);
    return router;
}

async function notifyBallanceUpdated(req: Request, res: Response) {
    logger.info('updtae ballance');
    // equity wallet main server call this api to notify ballance updated syncronously (no need to wait for response)
    // then this api will notify all connected clients via socket.io
    const socket = getSocketFromRequest(req);
    socket.emit('ballanceUpdated', { ballance: 100500 });
    res.send('api update ballance');
}

export { getUpdateRoutes };
