import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandsController } from './commands.controller';
import config from './config';
import { EventTransactionService } from './event-transaction.service';
import { EventsClientService } from './events-client.service';
import { Event } from './models/event.model';
import { Outbox } from './models/outbox.model';
import { OutboxService } from './outbox.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { Todo } from './models/todo.model';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Todo, Event, Outbox],
        // Note: not recommended for production
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Event, Outbox]),
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'queue-events',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('broker.url') as RmqUrl],
              queue: configService.get('broker.queue_events'),
              queueOptions: {
                durable: true,
              },
            },
          }),
        },
      ],
      isGlobal: true,
    }),
  ],
  controllers: [CommandsController],
  providers: [EventTransactionService, OutboxService, EventsClientService],
})
export class AppModule {}
