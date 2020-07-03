import express from 'express'
import 'express-async-errors' // Removes need to call next on errors in async functions
import cookieSession from 'cookie-session'

import { createOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes/index'
import { deleteOrderRouter } from './routes/delete'

import { errorHandler, NotFoundError, currentUser } from "@chtickets/common";

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app }