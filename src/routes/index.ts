import express from 'express';
import { getRootRoutes } from './root';
import { getUpdateRoutes } from './update';

function getRoutes() {
    const router = express.Router();
    router.use('/', getRootRoutes());
    router.use('/update', getUpdateRoutes());
    return router;
}

export { getRoutes };
