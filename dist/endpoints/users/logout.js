"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../auth/util/middleware");
exports.default = (req, res) => {
    res.clearCookie(middleware_1.JWT_COOKIE);
    res.status(204).send();
};
//# sourceMappingURL=logout.js.map