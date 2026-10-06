import { Injectable, NotFoundException } from '@nestjs/common';
import { KEEPA_MOCK_DATA } from '../../mock-data/keepa-mock.data';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
import { Product } from './interfaces/product.interface';

const AMAZON_REFERRAL_FEE_RATE = 0.15;
const FBA_FIXED_FEE = 4.15;

@Injectable()
export class AnalyzerService {
  findByUpc(upc: string): Product {
    const product = KEEPA_MOCK_DATA.find((item) => item.upc === upc);

    if (!product) {
      throw new NotFoundException(`Product with UPC ${upc} not found`);
    }

    return product;
  }

  calculateFbaMetrics(dto: AnalyzeProductDto): RoiResponseDto {
    const { amazonPrice, walmartPrice, shippingCost = 0 } = dto;

    const referralFee = amazonPrice * AMAZON_REFERRAL_FEE_RATE;
    const fbaFee = FBA_FIXED_FEE;
    const netProfit =
      amazonPrice - referralFee - fbaFee - walmartPrice - shippingCost;
    const roiPercentage = (netProfit / walmartPrice) * 100;

    return new RoiResponseDto({
      amazonPrice,
      walmartPrice,
      shippingCost,
      referralFee: Number(referralFee.toFixed(2)),
      fbaFee,
      netProfit: Number(netProfit.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
    });
  }
}
