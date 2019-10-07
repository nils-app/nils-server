"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.status(401).send('You must login to use this resource.');
};
//# sourceMappingURL=auth.js.map