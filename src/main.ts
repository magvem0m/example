import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`,
      pass: process.env.BROKER_USER,
      user: process.env.BROKER_PASSWORD,
      // TEMPORARY FIX
      queue: 'database'
    }
  });

  app.get(AppService).ExtendArray();

  await app.listen();
}
bootstrap();
