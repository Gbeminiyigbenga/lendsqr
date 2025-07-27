import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(json());

app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);

app.get('/healthz', (_, res) => res.sendStatus(200));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
