import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@chtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // find the ticket that the order is cancelling
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw an error
    if (!ticket) {
      throw new Error("ticket not found");
    }

    // remove the orderId from the ticket
    ticket.set({ orderId: undefined });

    // save the ticket
    await ticket.save();

    // Publish ticket update event to keep the version numbers in sync
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
