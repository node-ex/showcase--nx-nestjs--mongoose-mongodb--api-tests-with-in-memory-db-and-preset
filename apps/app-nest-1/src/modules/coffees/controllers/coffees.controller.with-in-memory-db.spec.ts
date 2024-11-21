import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CoffeesModule } from '../coffees.module';

describe('CoffeesController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    /**
     * https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
     */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    /**
     * Don't forget to close the app after the tests, otherwise Jest will hang.
     */
    await app.close();
    jest.restoreAllMocks();
  });

  it('GET /coffees', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await request(app.getHttpServer())
      .get('/coffees')
      .expect(200);

    expect(result.body).toEqual([]);
  });
});
