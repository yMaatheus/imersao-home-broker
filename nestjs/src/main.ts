import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

const { KAFKA_HOST, KAFKA_USERNAME, KAFKA_PASSWORD } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_HOST],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: KAFKA_USERNAME,
          password: KAFKA_PASSWORD,
        },
        connectionTimeout: 45000,
        // brokers: ['host.docker.internal:9094'],
      },
      consumer: {
        groupId: 'orders-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
