import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@chtickets/common'
import { queueGroupName } from './queue-group-name'

import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
    const { id, status, userId, version, ticket: { price } } = data
    const order = Order.build({
      id,
      status,
      userId,
      version,
      price,
    })
    await order.save()

    msg.ack()
  }

}