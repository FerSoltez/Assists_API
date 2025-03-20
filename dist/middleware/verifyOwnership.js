"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyOwnership = (req, res, next) => {
    const userIdFromToken = req.user.id;
    if (Number(req.params.id) !== userIdFromToken) {
        res.status(403).json({ message: "Acceso denegado. No puedes acceder a este recurso." });
        return;
    }
    next();
};
exports.default = verifyOwnership;
