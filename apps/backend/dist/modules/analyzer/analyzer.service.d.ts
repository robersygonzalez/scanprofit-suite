import { Product } from '@scanprofit/shared-types';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
export declare class AnalyzerService {
    findByUpc(upc: string): Product;
    private normalizeTitle;
    private titleMatchScore;
    findByTitle(title: string): Product | null;
    search(upc?: string, title?: string): Product;
    calculateFbaMetrics(dto: AnalyzeProductDto): RoiResponseDto;
}
