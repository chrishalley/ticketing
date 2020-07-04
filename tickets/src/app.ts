import express from 'express'
import 'express-async-errors' // Removes need to call next on errors in async functions
import cookieSession from 'cookie-session'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

import { errorHandler, NotFoundError, currentUser } from "@chtickets/common";

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: false
}))

app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app }