import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Product } from '@scanprofit/shared-types';
import { AnalyzerService } from './analyzer.service';
import { AnalyzeProductDto } from './dto/analyze-product.dto';
import { RoiResponseDto } from './dto/roi-response.dto';

@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Get('upc/:upc')
  findByUpc(@Param('upc') upc: string): Product {
    return this.analyzerService.findByUpc(upc);
  }

  @Get('search')
  search(@Query('upc') upc?: string, @Query('title') title?: string): Product {
    return this.analyzerService.search(upc, title);
  }

  @Post('calculate')
  calculate(@Body() analyzeProductDto: AnalyzeProductDto): RoiResponseDto {
    return this.analyzerService.calculateFbaMetrics(analyzeProductDto);
  }
}
