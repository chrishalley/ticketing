import express from 'express'
import 'express-async-errors' // Removes need to call next on errors in async functions
import cookieSession from 'cookie-session'

import { errorHandler, NotFoundError, currentUser } from "@chtickets/common";

import { createChargeRouter } from './routes/new'

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

app.use(createChargeRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app }