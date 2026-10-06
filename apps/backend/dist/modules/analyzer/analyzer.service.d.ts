import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
import { Product } from './interfaces/product.interface';
export declare class AnalyzerService {
    findByUpc(upc: string): Product;
    calculateFbaMetrics(dto: AnalyzeProductDto): RoiResponseDto;
}
