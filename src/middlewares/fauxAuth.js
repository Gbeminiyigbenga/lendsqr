"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fauxAuth = void 0;
const fauxAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId)
        return res.status(401).json({ message: 'Missing faux token' });
    req.user = { id: parseInt(userId) };
    next();
};
exports.fauxAuth = fauxAuth;
