"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const google_1 = __importDefault(require("./google"));
const github_1 = __importDefault(require("./github"));
const local_1 = __importDefault(require("./local"));
exports.router = express_1.default.Router();
exports.default = exports.router;
exports.router.use('/google', google_1.default);
exports.router.use('/github', github_1.default);
exports.router.use('/local', local_1.default);
passport_1.default.serializeUser((userId, done) => {
    done(null, userId);
});
passport_1.default.deserializeUser((userId, done) => {
    done(null, userId);
});
//# sourceMappingURL=index.js.map