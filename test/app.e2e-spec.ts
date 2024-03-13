import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/products/blah (GET) fails on invalid non-number ID', () => {
    return request(app.getHttpServer())
      .get('/products/blah')
      .expect(400);
  });

  it('/reviews/blah (GET) fails on invalid non-number ID', () => {
    return request(app.getHttpServer())
      .get('/reviews/blah')
      .expect(400);
  });
});
