import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@scanprofit/shared-types';
import { KEEPA_MOCK_DATA } from '../../mock-data/keepa-mock.data';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';

const AMAZON_REFERRAL_FEE_RATE = 0.15;
const FBA_FIXED_FEE = 4.15;
const TITLE_MATCH_MIN_WORD_LENGTH = 3;
const TITLE_MATCH_THRESHOLD = 0.5;

const LIGHTING_KEYWORDS = ['luz', 'luces', 'solar', 'lampara', 'granero', 'street'];

const LIGHTING_MOCK_PRODUCT: Product = {
  upc: '000000000000',
  title: 'Solar Barn Street Light - Lámpara Solar de Granero',
  bsr: 1500,
  amazonPrice: 59.99,
  imageUrl: 'https://m.media-amazon.com/images/I/71SolarBarnLight._AC_SL1500_.jpg',
  asin: 'B09X123456',
  referralFee: 9.0,
  fbaFee: 5.5,
};

@Injectable()
export class AnalyzerService {
  findByUpc(upc: string): Product {
    const product = KEEPA_MOCK_DATA.find((item) => item.upc === upc);

    if (!product) {
      throw new NotFoundException(`Product with UPC ${upc} not found`);
    }

    return product;
  }

  private stripAccents(value: string): string {
    const combiningDiacritics = new RegExp('[\\u0300-\\u036f]', 'g');
    return value.normalize('NFD').replace(combiningDiacritics, '');
  }

  private normalizeTitle(value: string): string[] {
    return this.stripAccents(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((word) => word.length >= TITLE_MATCH_MIN_WORD_LENGTH);
  }

  private matchesLightingKeyword(title: string): boolean {
    const words = new Set(this.normalizeTitle(title));
    return LIGHTING_KEYWORDS.some((keyword) => words.has(keyword));
  }

  private titleMatchScore(query: string, candidate: string): number {
    const queryWords = new Set(this.normalizeTitle(query));
    if (queryWords.size === 0) return 0;

    const candidateWords = new Set(this.normalizeTitle(candidate));
    let matches = 0;
    for (const word of queryWords) {
      if (candidateWords.has(word)) matches += 1;
    }

    return matches / queryWords.size;
  }

  findByTitle(title: string): Product | null {
    if (this.matchesLightingKeyword(title)) {
      return LIGHTING_MOCK_PRODUCT;
    }

    let best: { product: Product; score: number } | null = null;

    for (const product of KEEPA_MOCK_DATA) {
      const score = this.titleMatchScore(title, product.title);
      if (score >= TITLE_MATCH_THRESHOLD && (!best || score > best.score)) {
        best = { product, score };
      }
    }

    return best?.product ?? null;
  }

  search(upc?: string, title?: string): Product {
    const byUpc = upc ? KEEPA_MOCK_DATA.find((item) => item.upc === upc) : undefined;
    const product = byUpc ?? (title ? this.findByTitle(title) : null);

    if (!product) {
      throw new NotFoundException(
        'No se encontró un producto de Amazon equivalente por UPC ni título.',
      );
    }

    return product;
  }

  calculateFbaMetrics(dto: AnalyzeProductDto): RoiResponseDto {
    const { amazonPrice, walmartPrice, shippingCost = 0 } = dto;

    const referralFee = amazonPrice * AMAZON_REFERRAL_FEE_RATE;
    const fbaFee = FBA_FIXED_FEE;
    const totalCost = walmartPrice + shippingCost;
    const netProfit = amazonPrice - referralFee - fbaFee - totalCost;
    const roiPercentage = (netProfit / totalCost) * 100;

    return new RoiResponseDto({
      amazonPrice,
      walmartPrice,
      shippingCost,
      totalCost: Number(totalCost.toFixed(2)),
      referralFee: Number(referralFee.toFixed(2)),
      fbaFee,
      netProfit: Number(netProfit.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
    });
  }
}
