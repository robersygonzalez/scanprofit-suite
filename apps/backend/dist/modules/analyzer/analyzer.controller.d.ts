import { AnalyzerService } from './analyzer.service';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
import { Product } from './interfaces/product.interface';
export declare class AnalyzerController {
    private readonly analyzerService;
    constructor(analyzerService: AnalyzerService);
    findByUpc(upc: string): Product;
    calculate(analyzeProductDto: AnalyzeProductDto): RoiResponseDto;
}
