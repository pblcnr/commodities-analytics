import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly token: string;
  private readonly phoneNumberId: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('WHATSAPP_TOKEN') || '';
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
    const apiVersion = this.configService.get<string>('WHATSAPP_API_VERSION') || 'v19.0';
    this.apiUrl = `https://graph.facebook.com/${apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendMessage(toPhoneNumber: string, text: string): Promise<boolean> {
    if (!this.token || !this.phoneNumberId) {
      this.logger.warn('WhatsApp credentials not fully configured. Message not sent.');
      return false;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: toPhoneNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: text,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`WhatsApp API error: ${response.status} - ${errorData}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
}
