import express from 'express';
import { getRootRoutes } from './root.js';

function getRoutes() {
    const router = express.Router();
    router.use('/', getRootRoutes());
    return router;
}

export { getRoutes };
