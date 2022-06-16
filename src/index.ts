import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth'

dotenv.config();

const app: Express = express();

app.use('/', authRouter)

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running here');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

