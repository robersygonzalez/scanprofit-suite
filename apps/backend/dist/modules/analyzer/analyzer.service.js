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
let AnalyzerService = class AnalyzerService {
    findByUpc(upc) {
        const product = keepa_mock_data_1.KEEPA_MOCK_DATA.find((item) => item.upc === upc);
        if (!product) {
            throw new common_1.NotFoundException(`Product with UPC ${upc} not found`);
        }
        return product;
    }
    calculateFbaMetrics(dto) {
        const { amazonPrice, walmartPrice, shippingCost = 0 } = dto;
        const referralFee = amazonPrice * AMAZON_REFERRAL_FEE_RATE;
        const fbaFee = FBA_FIXED_FEE;
        const netProfit = amazonPrice - referralFee - fbaFee - walmartPrice - shippingCost;
        const roiPercentage = (netProfit / walmartPrice) * 100;
        return new roi_response_dto_1.RoiResponseDto({
            amazonPrice,
            walmartPrice,
            shippingCost,
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