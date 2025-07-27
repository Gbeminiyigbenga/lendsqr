import { Request, Response } from 'express';
import db from '../db/knex';
import axios from 'axios';

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const check = await axios.get(`https://api.adjutor.lendsqr.com/karma/users/${email}`);
    if (check.data.blacklisted) {
      return res.status(403).json({ message: 'User is blacklisted' });
    }

    const [user] = await db('users').insert({ name, email }).returning('*');
    await db('wallets').insert({ user_id: user.id, balance: 0 });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};
