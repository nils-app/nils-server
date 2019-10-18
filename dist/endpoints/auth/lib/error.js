"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = (res) => (status, ...errors) => {
    return res.status(status).send({
        errors,
    });
};
exports.default = errors;
//# sourceMappingURL=error.js.map