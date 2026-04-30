import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommoditiesService } from './commodities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commodities')
@UseGuards(JwtAuthGuard)
export class CommoditiesController {
  constructor(private readonly commoditiesService: CommoditiesService) {}

  /**
   * GET /api/v1/commodities
   * Returns the list of all available commodities with price and forecast data.
   */
  @Get()
  findAll() {
    return this.commoditiesService.findAll();
  }

  /**
   * GET /api/v1/commodities/:id
   * Returns a single commodity by its ID (e.g. "milho", "soja").
   * Throws 404 if not found.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.commoditiesService.findById(id);
  }
}
