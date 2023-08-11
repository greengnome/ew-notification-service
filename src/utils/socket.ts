import { Request } from 'express';

export const getSocketFromRequest = (req: Request) => {
    return req.app.get('socketio');
};
