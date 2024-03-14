import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewProcessorService {
  getHello(): string {
    return 'Hello World!';
  }
}
