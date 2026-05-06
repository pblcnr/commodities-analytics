import { Module, Global } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WhatsAppService } from './whatsapp.service';

@Global()
@Module({
  providers: [TelegramService, WhatsAppService],
  exports: [TelegramService, WhatsAppService],
})
export class IntegrationsModule {}
