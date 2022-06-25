import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import authRouter from './routes/auth'
import userRouter from './routes/user'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', authRouter)
app.use('/user', userRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running here');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

