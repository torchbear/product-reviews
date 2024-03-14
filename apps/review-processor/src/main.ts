import { NestFactory } from '@nestjs/core';
import { ReviewProcessorModule } from './review-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(ReviewProcessorModule);
  await app.listen(3000);
}
bootstrap();
