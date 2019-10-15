"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const google_1 = __importDefault(require("./google"));
const github_1 = __importDefault(require("./github"));
exports.router = express_1.default.Router();
exports.default = exports.router;
exports.router.use('/google', google_1.default);
exports.router.use('/github', github_1.default);
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    done(null, id);
});
//# sourceMappingURL=index.js.map