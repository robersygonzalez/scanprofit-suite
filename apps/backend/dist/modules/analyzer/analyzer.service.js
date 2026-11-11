"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const keepa_mock_data_1 = require("../../mock-data/keepa-mock.data");
const roi_response_dto_1 = require("./dto/roi-response.dto");
const AMAZON_REFERRAL_FEE_RATE = 0.15;
const FBA_FIXED_FEE = 4.15;
const TITLE_MATCH_MIN_WORD_LENGTH = 3;
const TITLE_MATCH_THRESHOLD = 0.5;
const LIGHTING_KEYWORDS = ['luz', 'luces', 'solar', 'lampara', 'granero', 'street'];
const LIGHTING_MOCK_PRODUCT = {
    upc: '000000000000',
    title: 'Solar Barn Street Light - Lámpara Solar de Granero',
    bsr: 1500,
    amazonPrice: 59.99,
    imageUrl: 'https://m.media-amazon.com/images/I/71SolarBarnLight._AC_SL1500_.jpg',
    asin: 'B09X123456',
    referralFee: 9.0,
    fbaFee: 5.5,
};
let AnalyzerService = class AnalyzerService {
    findByUpc(upc) {
        const product = keepa_mock_data_1.KEEPA_MOCK_DATA.find((item) => item.upc === upc);
        if (!product) {
            throw new common_1.NotFoundException(`Product with UPC ${upc} not found`);
        }
        return product;
    }
    stripAccents(value) {
        const combiningDiacritics = new RegExp('[\\u0300-\\u036f]', 'g');
        return value.normalize('NFD').replace(combiningDiacritics, '');
    }
    normalizeTitle(value) {
        return this.stripAccents(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .split(' ')
            .filter((word) => word.length >= TITLE_MATCH_MIN_WORD_LENGTH);
    }
    matchesLightingKeyword(title) {
        const words = new Set(this.normalizeTitle(title));
        return LIGHTING_KEYWORDS.some((keyword) => words.has(keyword));
    }
    titleMatchScore(query, candidate) {
        const queryWords = new Set(this.normalizeTitle(query));
        if (queryWords.size === 0)
            return 0;
        const candidateWords = new Set(this.normalizeTitle(candidate));
        let matches = 0;
        for (const word of queryWords) {
            if (candidateWords.has(word))
                matches += 1;
        }
        return matches / queryWords.size;
    }
    findByTitle(title) {
        if (this.matchesLightingKeyword(title)) {
            return LIGHTING_MOCK_PRODUCT;
        }
        let best = null;
        for (const product of keepa_mock_data_1.KEEPA_MOCK_DATA) {
            const score = this.titleMatchScore(title, product.title);
            if (score >= TITLE_MATCH_THRESHOLD && (!best || score > best.score)) {
                best = { product, score };
            }
        }
        return best?.product ?? null;
    }
    search(upc, title) {
        const byUpc = upc ? keepa_mock_data_1.KEEPA_MOCK_DATA.find((item) => item.upc === upc) : undefined;
        const product = byUpc ?? (title ? this.findByTitle(title) : null);
        if (!product) {
            throw new common_1.NotFoundException('No se encontró un producto de Amazon equivalente por UPC ni título.');
        }
        return product;
    }
    calculateFbaMetrics(dto) {
        const { amazonPrice, walmartPrice, shippingCost = 0 } = dto;
        const referralFee = amazonPrice * AMAZON_REFERRAL_FEE_RATE;
        const fbaFee = FBA_FIXED_FEE;
        const totalCost = walmartPrice + shippingCost;
        const netProfit = amazonPrice - referralFee - fbaFee - totalCost;
        const roiPercentage = (netProfit / totalCost) * 100;
        return new roi_response_dto_1.RoiResponseDto({
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
};
exports.AnalyzerService = AnalyzerService;
exports.AnalyzerService = AnalyzerService = __decorate([
    (0, common_1.Injectable)()
], AnalyzerService);
//# sourceMappingURL=analyzer.service.js.map