import { Module } from '@nestjs/common';
import { ReviewProcessorController } from './review-processor.controller';
import { ReviewProcessorService } from './review-processor.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [ReviewProcessorController],
  providers: [ReviewProcessorService],
})
export class ReviewProcessorModule {}
