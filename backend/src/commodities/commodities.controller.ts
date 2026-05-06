import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommoditiesService } from './commodities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commodities')
@UseGuards(JwtAuthGuard)
export class CommoditiesController {
  constructor(private readonly commoditiesService: CommoditiesService) {}

  /**
   * GET /api/v1/commodities
   * Returns the list of all available commodities.
   */
  @Get()
  findAll() {
    return this.commoditiesService.findAll();
  }

  /**
   * GET /api/v1/commodities/:id/history
   * Returns the history of a single commodity by its ID.
   * Throws 404 if not found.
   */
  @Get(':id/history')
  findHistoryById(@Param('id', ParseIntPipe) id: number) {
    return this.commoditiesService.findByIdWithHistory(id);
  }

  /**
   * POST /api/v1/commodities/:id/forecast
   * Returns the forecasted prices for the commodity.
   */
  @Post(':id/forecast')
  getForecast(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any // using any temporarily to avoid circular dependencies or simply create it below
  ) {
    const periodos = body?.periodos_futuros || 3;
    return this.commoditiesService.getForecast(id, periodos);
  }
}
