import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log(`Server is running at http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`UI at http://localhost:${process.env.PORT ?? 3000}/index.html`);
}
bootstrap();

