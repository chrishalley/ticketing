import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  validateRequest,
  BadRequestError
} from '@chtickets/common'

import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

const router = Router()

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })

    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })
    res.send(ticket)
})

export { router as updateTicketRouter }