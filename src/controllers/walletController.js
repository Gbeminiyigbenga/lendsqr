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
exports.withdrawFunds = exports.transferFunds = exports.fundWallet = void 0;
const knex_1 = __importDefault(require("../db/knex"));
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = req.body;
    try {
        yield (0, knex_1.default)('wallets').where({ user_id }).increment('balance', amount);
        yield (0, knex_1.default)('transactions').insert({ user_id, amount, type: 'fund' });
        res.status(200).json({ message: 'Wallet funded successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Funding failed', err });
    }
});
exports.fundWallet = fundWallet;
const transferFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from_user_id, to_user_id, amount } = req.body;
    const trx = yield knex_1.default.transaction();
    try {
        const fromWallet = yield trx('wallets').where({ user_id: from_user_id }).first();
        if (!fromWallet || fromWallet.balance < amount) {
            throw new Error('Insufficient funds');
        }
        yield trx('wallets').where({ user_id: from_user_id }).decrement('balance', amount);
        yield trx('wallets').where({ user_id: to_user_id }).increment('balance', amount);
        yield trx('transactions').insert([
            { user_id: from_user_id, amount, type: 'transfer_out' },
            { user_id: to_user_id, amount, type: 'transfer_in' }
        ]);
        yield trx.commit();
        res.status(200).json({ message: 'Transfer successful' });
    }
    catch (err) {
        yield trx.rollback();
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.transferFunds = transferFunds;
const withdrawFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = req.body;
    try {
        const wallet = yield (0, knex_1.default)('wallets').where({ user_id }).first();
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        yield (0, knex_1.default)('wallets').where({ user_id }).decrement('balance', amount);
        yield (0, knex_1.default)('transactions').insert({ user_id, amount, type: 'withdraw' });
        res.status(200).json({ message: 'Withdrawal successful' });
    }
    catch (err) {
        res.status(500).json({ message: 'Withdrawal failed', err });
    }
});
exports.withdrawFunds = withdrawFunds;
