"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};
//# sourceMappingURL=async.js.map