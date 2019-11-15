"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csrf_1 = require("../../middleware/csrf");
exports.default = (req, res, next) => {
    const csrf = csrf_1.generateCSRFToken(req.user.uuid);
    const payload = {
        user: req.user,
        csrf,
    };
    res.header(csrf_1.CSRF_HEADER, csrf).json(payload);
};
//# sourceMappingURL=current.js.map