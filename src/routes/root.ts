import express, { Request, Response } from 'express';
import logger from 'loglevel';

function getRootRoutes() {
    const router = express.Router();
    router.get('/ping', ping);
    return router;
}

async function ping(req: Request, res: Response) {
    logger.info('Ping! api/ping');
    res.send('pong');
}

export { getRootRoutes };
