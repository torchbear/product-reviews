import { NestFactory } from '@nestjs/core';
import { ReviewProcessorModule } from './review-processor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: ['.env.development', '.env.development.docker'],
});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReviewProcessorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`,
        ],
        queue: 'products_changes_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
