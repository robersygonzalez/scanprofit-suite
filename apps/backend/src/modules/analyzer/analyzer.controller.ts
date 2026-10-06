import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';
import { Product } from './interfaces/product.interface';

@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Get('upc/:upc')
  findByUpc(@Param('upc') upc: string): Product {
    return this.analyzerService.findByUpc(upc);
  }

  @Post('calculate')
  calculate(@Body() analyzeProductDto: AnalyzeProductDto): RoiResponseDto {
    return this.analyzerService.calculateFbaMetrics(analyzeProductDto);
  }
}
