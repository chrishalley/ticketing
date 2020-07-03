import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@chtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    data,
    msg
  }
}

it('should create and save a ticket', async () => {
  const { listener, data, msg } = await setup()
  // Call the onMessage function with the data object + the message object
  await listener.onMessage(data, msg)
  
  // Write assertions to make sure the ticket was created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('should ack the message', async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + the message object
  await listener.onMessage(data, msg);

  // Assert that event has been acknowledged
  expect(msg.ack).toHaveBeenCalled();
})