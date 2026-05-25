import { Controller, Get, Patch, Param, Delete, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    @InjectQueue('alerts_queue') private readonly alertsQueue: Queue,
  ) {}

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const userId = parseInt(req.user.sub, 10);
    return this.alertsService.findAll(userId);
  }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() body: {
      commodityId: number;
      condition: 'Abaixo' | 'Acima' | 'bom';
      targetPrice?: number;
      channel: 'Telegram' | 'WhatsApp' | 'E-mail';
    },
  ) {
    const userId = parseInt(req.user.sub, 10);
    return this.alertsService.create(userId, body);
  }

  @Post('trigger-test-job')
  async triggerTestJob(@Body() body: { commodityId: number; currentPrice: number; variation: number }) {
    const { commodityId, currentPrice, variation } = body;
    const job = await this.alertsQueue.add('price_alert_triggered', {
      commodity_id: commodityId || 1,
      current_price: currentPrice || 50.0,
      variation: variation || 5.0,
    });
    return { success: true, jobId: job.id };
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.alertsService.toggleStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}


