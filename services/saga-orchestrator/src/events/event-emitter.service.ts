import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TOKENS } from '../common/constants/injection-tokens';
import { COMMAND_TOPICS } from '@shared/messages/topics';
import {
  CancelOrderCommand,
  CompleteOrderCommand,
  RefundPaymentCommand,
  ReserveStockCommand,
  StartPaymentCommand,
  StartShippingCommand,
} from '@shared/messages';

@Injectable()
export class EventEmitterService {
  constructor(@Inject(TOKENS.RABBITMQ) private readonly client: ClientProxy) {}

  emitStartPayment(command: StartPaymentCommand) {
    this.client.emit(COMMAND_TOPICS.START_PAYMENT, command);
  }

  emitReserveStock(command: ReserveStockCommand) {
    this.client.emit(COMMAND_TOPICS.RESERVE_STOCK, command);
  }

  emitStartShipping(command: StartShippingCommand) {
    this.client.emit(COMMAND_TOPICS.START_SHIPPING, command);
  }

  emitRefund(command: RefundPaymentCommand) {
    this.client.emit(COMMAND_TOPICS.REFUND_PAYMENT, command);
  }

  emitCancelOrder(command: CancelOrderCommand) {
    this.client.emit(COMMAND_TOPICS.CANCEL_ORDER, command);
  }

  emitCompleteOrder(command: CompleteOrderCommand) {
    this.client.emit(COMMAND_TOPICS.COMPLETE_ORDER, command);
  }
}
