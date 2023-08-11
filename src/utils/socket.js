export const getSocketFromRequest = (req) => {
    return req.app.get('socketio');
};
