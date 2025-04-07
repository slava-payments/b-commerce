import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Provider } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TOKENS } from '../common/constants/injection-tokens';

export const RabbitMQProvider: Provider = {
  provide: TOKENS.RABBITMQ,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [config.rabbitmqUrl],
        queue: 'saga_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
