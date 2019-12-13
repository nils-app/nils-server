"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = (res) => (status, ...errors) => {
    let returnErrors = errors;
    if (errors.length === 1 && Array.isArray(errors[0])) {
        returnErrors = errors[0];
    }
    return res.status(status).send({
        errors: returnErrors,
    });
};
exports.default = errors;
//# sourceMappingURL=error.js.map