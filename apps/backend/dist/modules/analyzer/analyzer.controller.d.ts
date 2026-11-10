import { Product } from '@scanprofit/shared-types';
import { AnalyzerService } from './analyzer.service';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
export declare class AnalyzerController {
    private readonly analyzerService;
    constructor(analyzerService: AnalyzerService);
    findByUpc(upc: string): Product;
    search(upc?: string, title?: string): Product;
    calculate(analyzeProductDto: AnalyzeProductDto): RoiResponseDto;
}
