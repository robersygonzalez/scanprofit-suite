"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerController = void 0;
const common_1 = require("@nestjs/common");
const analyzer_service_1 = require("./analyzer.service");
const analyze_product_dto_1 = require("./dto/analyze-product.dto");
const roi_response_dto_1 = require("./dto/roi-response.dto");
let AnalyzerController = class AnalyzerController {
    constructor(analyzerService) {
        this.analyzerService = analyzerService;
    }
    findByUpc(upc) {
        return this.analyzerService.findByUpc(upc);
    }
    calculate(analyzeProductDto) {
        return this.analyzerService.calculateFbaMetrics(analyzeProductDto);
    }
};
exports.AnalyzerController = AnalyzerController;
__decorate([
    (0, common_1.Get)('upc/:upc'),
    __param(0, (0, common_1.Param)('upc')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AnalyzerController.prototype, "findByUpc", null);
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_product_dto_1.AnalyzeProductDto]),
    __metadata("design:returntype", roi_response_dto_1.RoiResponseDto)
], AnalyzerController.prototype, "calculate", null);
exports.AnalyzerController = AnalyzerController = __decorate([
    (0, common_1.Controller)('analyzer'),
    __metadata("design:paramtypes", [analyzer_service_1.AnalyzerService])
], AnalyzerController);
//# sourceMappingURL=analyzer.controller.js.map