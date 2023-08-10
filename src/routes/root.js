import express from 'express';
import logger from 'loglevel';

function getRootRoutes() {
    const router = express.Router();
    router.get('/ping', ping);
    return router;
}

async function ping(req, res) {
    logger.info('Ping! api/ping');
    res.send('pong');
}

export { getRootRoutes };
