import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './tasks/transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const log = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor);
  const port = 3000;
  await app.listen(port);
  log.log(`Application is running at ${port}`)
}
bootstrap();
