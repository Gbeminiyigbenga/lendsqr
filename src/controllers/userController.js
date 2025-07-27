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
exports.createUser = void 0;
const knex_1 = __importDefault(require("../db/knex"));
const axios_1 = __importDefault(require("axios"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const check = yield axios_1.default.get(`https://api.adjutor.lendsqr.com/karma/users/${email}`);
        if (check.data.blacklisted) {
            return res.status(403).json({ message: 'User is blacklisted' });
        }
        const [user] = yield (0, knex_1.default)('users').insert({ name, email }).returning('*');
        yield (0, knex_1.default)('wallets').insert({ user_id: user.id, balance: 0 });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }
});
exports.createUser = createUser;
