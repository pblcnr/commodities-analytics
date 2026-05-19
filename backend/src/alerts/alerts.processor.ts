import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../integrations/whatsapp.service';

@Processor('alerts_queue')
export class AlertsProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'price_alert_triggered') {
      const { commodity_id, current_price, variation } = job.data;
      
      this.logger.log(`Received price alert for commodity ID ${commodity_id}: Price = ${current_price}`);

      // Buscar alertas ativos para essa materia_prima
      const activeAlerts = await this.prisma.alerta.findMany({
        where: {
          id_materia_prima: commodity_id,
          ativo: true,
        },
        include: {
          usuario: true,
          materia_prima: true,
        },
      });

      for (const alerta of activeAlerts) {
        
        const mensagem = `*Alerta de Mercado*\n\nA commodity *${alerta.materia_prima.nome}* registrou movimentação relevante.\nPreço atual: R$ ${current_price}\nVariação: ${variation}%\n\nVerifique o painel para mais detalhes.`;

        await this.prisma.notificacao.create({
          data: {
            id_alerta: alerta.id_alerta,
            id_usuario: alerta.id_usuario,
            canal_envio: alerta.usuario.canal_notificacao_preferido || 'whatsapp',
            titulo: `Alerta: ${alerta.materia_prima.nome}`,
            mensagem: mensagem,
            status_envio: 'enviado',
            enviado_em: new Date()
          },
        });

        if (alerta.usuario.telefone_opcional) {
          const success = await this.whatsappService.sendMessage(alerta.usuario.telefone_opcional, mensagem);
          if (success) {
            this.logger.log(`Notificação enviada para ${alerta.usuario.nome} no WhatsApp.`);
          } else {
            this.logger.warn(`Falha ao enviar notificação para ${alerta.usuario.nome}.`);
          }
        }
      }
    }
  }
}
