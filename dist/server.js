"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const transferwise_1 = require("./lib/transferwise");
/**
 * Start Express server.
 */
const server = app_1.default.listen(app_1.default.get('port'), () => {
    console.log('[%s] App is running at http://localhost:%d', app_1.default.get('env'), app_1.default.get('port'));
});
// Preload the transferwise profile id
transferwise_1.getTransferWiseProfile();
exports.default = server;
//# sourceMappingURL=server.js.map