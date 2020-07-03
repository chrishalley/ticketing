import nats from 'node-nats-streaming'

import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
}); // stan is the nats client

stan.on('connect', async () => {
  console.log('publisher connected to NATS')

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'Concert',
      price: 20
    })
  } catch (e) {
    console.error(e)
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   name: 'concert',
  //   price: '20'
  // })

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published')
  // })
});