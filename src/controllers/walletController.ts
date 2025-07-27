import { Request, Response } from 'express';
import db from '../db/knex';

export const fundWallet = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;
  try {
    await db('wallets').where({ user_id }).increment('balance', amount);
    await db('transactions').insert({ user_id, amount, type: 'fund' });
    res.status(200).json({ message: 'Wallet funded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Funding failed', err });
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  const { from_user_id, to_user_id, amount } = req.body;
  const trx = await db.transaction();
  try {
    const fromWallet = await trx('wallets').where({ user_id: from_user_id }).first();
    if (!fromWallet || fromWallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    await trx('wallets').where({ user_id: from_user_id }).decrement('balance', amount);
    await trx('wallets').where({ user_id: to_user_id }).increment('balance', amount);

    await trx('transactions').insert([
      { user_id: from_user_id, amount, type: 'transfer_out' },
      { user_id: to_user_id, amount, type: 'transfer_in' }
    ]);

    await trx.commit();
    res.status(200).json({ message: 'Transfer successful' });
  } catch (err) {
    await trx.rollback();
    if (err instanceof Error) {
        res.status(400).json({ message: err.message });
    } else {
        res.status(400).json({ message: 'Unknown error' });
    }
  }
};

export const withdrawFunds = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;
  try {
    const wallet = await db('wallets').where({ user_id }).first();
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    await db('wallets').where({ user_id }).decrement('balance', amount);
    await db('transactions').insert({ user_id, amount, type: 'withdraw' });
    res.status(200).json({ message: 'Withdrawal successful' });
  } catch (err) {
    res.status(500).json({ message: 'Withdrawal failed', err });
  }
};
