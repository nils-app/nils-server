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
const db_1 = __importDefault(require("../../../db"));
/**
 * Check if a user exists in our db with a provider and an email
 * and creates the user if not
 * Returns the user id
 */
exports.authWithProvider = (provider, token, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (token === null) {
        throw new Error('Unable to login user, missing authentication token');
    }
    const hasEmail = email && email.length > 0;
    try {
        let params = [
            provider,
            token,
        ];
        let data = yield db_1.default.query('SELECT user_id FROM user_logins WHERE auth_provider = $1 AND token = $2', params);
        if (data.rows.length > 0) {
            console.log('found user in logins table', data.rows);
            return data.rows[0].user_id;
        }
        // no login exists for this user, check by email
        if (hasEmail) {
            params = [email];
            data = yield db_1.default.query('SELECT user_id FROM user_email WHERE email = $1', params);
            if (data.rows.length > 0) {
                console.log('found user in emails table', data.rows);
                const user_id = data.rows[0].user_id;
                // Insert a new entry in the logins table for this provider
                params = [
                    user_id,
                    provider,
                    token,
                ];
                yield db_1.default.query('INSERT INTO user_logins(user_id, auth_provider, token) VALUES ($1, $2, $3)', params);
                return user_id;
            }
        }
        console.log('user not found in any table, adding to all');
        // user does not exist, insert in all three places
        data = yield db_1.default.query('INSERT INTO users(balance) VALUES(0) RETURNING *');
        const user_id = data.rows[0].uuid;
        params = [
            user_id,
            provider,
            token,
        ];
        yield db_1.default.query('INSERT INTO user_logins(user_id, auth_provider, token) VALUES ($1, $2, $3)', params);
        if (hasEmail) {
            params = [
                user_id,
                email,
            ];
            yield db_1.default.query('INSERT INTO user_email(user_id, email) VALUES ($1, $2)', params);
        }
        return user_id;
    }
    catch (e) {
        console.error('Unable to check login status for user', e);
        throw new Error('Unable to login user');
    }
});
//# sourceMappingURL=auth.js.map