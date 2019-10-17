"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../auth/util/middleware");
const constants_1 = require("../../constants");
exports.default = (req, res) => {
    res.clearCookie(middleware_1.JWT_COOKIE);
    res.redirect(constants_1.DOMAIN_FRONTEND);
};
//# sourceMappingURL=logout.js.map