"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
exports.PROFILE_ID = null;
exports.getTransferWiseProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield exports.transferwiseRequest('/v1/profiles', 'GET', null, true);
        if (data && data.length > 0) {
            const businessProfile = data.find((profile) => profile.type === 'business');
            if (businessProfile) {
                exports.PROFILE_ID = businessProfile.id;
                console.log('Found profile id', exports.PROFILE_ID);
            }
        }
    }
    catch (e) {
        console.error('Unable to get TransferWise Profile Id', e.message);
    }
});
exports.transferwiseRequest = (path, method, data, skipProfileCheck) => __awaiter(void 0, void 0, void 0, function* () {
    if (!skipProfileCheck && !exports.PROFILE_ID) {
        throw new Error('TransferWise API not available, please try again later.');
    }
    const options = {
        url: `${constants_1.TRANSFERWISE_BASE}${path}`,
        method,
        timeout: 6000,
        headers: {
            'Authorization': "Bearer " + constants_1.TRANSFERWISE_API_KEY,
            'Content-Type': 'application/json',
        },
        data,
    };
    const response = yield axios_1.default(options);
    return yield response.data;
});
//# sourceMappingURL=transferwise.js.map