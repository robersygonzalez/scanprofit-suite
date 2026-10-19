import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AnalyzerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/analyzer/calculate (POST) returns 60% ROI for $15 Walmart price, $1 shipping, $35 Amazon price', () => {
    return request(app.getHttpServer())
      .post('/analyzer/calculate')
      .send({
        amazonPrice: 35,
        walmartPrice: 15,
        shippingCost: 1,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.totalCost).toBe(16);
        expect(res.body.referralFee).toBe(5.25);
        expect(res.body.fbaFee).toBe(4.15);
        expect(res.body.netProfit).toBe(9.6);
        expect(res.body.roiPercentage).toBe(60);
      });
  });
});
