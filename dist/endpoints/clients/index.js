'use strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const login_1 = __importDefault(require('./login'))
exports.router = express_1.default.Router()
exports.default = exports.router
exports.router.post('/login', login_1.default)
// # sourceMappingURL=index.js.map
