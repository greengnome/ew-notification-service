import express from 'express';
import { getRootRoutes } from './root.js';
import { getUpdateRoutes } from './update.js';

function getRoutes() {
    const router = express.Router();
    router.use('/', getRootRoutes());
    router.use('/update', getUpdateRoutes());
    return router;
}

export { getRoutes };
