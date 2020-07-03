import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@chtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, id, version } = data;

    const ticket = await Ticket.findByEvent({ id, version })
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title, price })
    await ticket.save();

    msg.ack();
  }
}
