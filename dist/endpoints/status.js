'use strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_list_endpoints_1 = __importDefault(require('express-list-endpoints'))
var pjson = require('../../package.json')
exports.default = (app) => (req, res) => {
  res.json({
    version: pjson.version,
    endpoints: express_list_endpoints_1.default(app)
  })
}
// # sourceMappingURL=status.js.map
