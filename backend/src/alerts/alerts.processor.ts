import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../integrations/telegram.service';
import { EmailService } from '../integrations/email.service';

@Processor('alerts_queue')
export class AlertsProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'price_alert_triggered') {
      const { commodity_id, current_price, variation } = job.data;

      this.logger.log(`Received price alert trigger for commodity ID ${commodity_id}. Fallback Price = ${current_price}`);
      const recomendacao = await this.prisma.recomendacao_compra.findFirst({
        where: {
          id_materia_prima: commodity_id,
        },
        orderBy: {
          criado_em: 'desc',
        },
      });

      const preco_atual_referencia = recomendacao
        ? Number(recomendacao.preco_atual_referencia)
        : Number(current_price);

      const variacao_percentual = recomendacao?.variacao_percentual
        ? Number(recomendacao.variacao_percentual)
        : Number(variation || 0);

      const classificacao_compra = recomendacao?.classificacao_compra || 'regular';

      this.logger.log(
        `Resolved Commodity values -> Price: R$ ${preco_atual_referencia}, Variation: ${variacao_percentual}%, Classification: ${classificacao_compra}`
      );

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
        let dispararAlerta = false;

        if (alerta.tipo_alerta === 'preco_maximo_compra' && alerta.valor_limite_opcional) {
          const limite = Number(alerta.valor_limite_opcional);
          if (preco_atual_referencia <= limite) {
            dispararAlerta = true;
          }
        } else if (alerta.tipo_alerta === 'preco_subir_acima' && alerta.valor_limite_opcional) {
          const limite = Number(alerta.valor_limite_opcional);
          if (preco_atual_referencia >= limite) {
            dispararAlerta = true;
          }
        } else if (alerta.tipo_alerta === 'mudanca_para_bom') {
          if (classificacao_compra === 'bom') {
            dispararAlerta = true;
          }
        } else if (alerta.tipo_alerta === 'variacao_percentual' && alerta.variacao_percentual_limite_opcional) {
          const limiteVariacao = Math.abs(Number(alerta.variacao_percentual_limite_opcional));
          if (Math.abs(variacao_percentual) >= limiteVariacao) {
            dispararAlerta = true;
          }
        } else {
          // TODO: unknown alert type — currently fires unconditionally; define behaviour before adding new types
          dispararAlerta = true;
        }

        if (!dispararAlerta) {
          this.logger.log(`Alert ID ${alerta.id_alerta} for user ${alerta.usuario.nome} conditions not met. Skipping.`);
          continue;
        }

        this.logger.log(`Alert ID ${alerta.id_alerta} for user ${alerta.usuario.nome} triggered! Sending notification...`);

        const limiteFormatado = alerta.valor_limite_opcional
          ? `(Limite: R$ ${Number(alerta.valor_limite_opcional).toFixed(2)})`
          : '';
        const canal = (alerta.usuario.canal_notificacao_preferido || 'email').toLowerCase();
        const titulo = `Alerta: ${alerta.materia_prima.nome}`;

        const mensagem =
          `*Alerta de Mercado - ${alerta.materia_prima.nome.toUpperCase()}*\n\n` +
          `A condição do seu alerta foi atendida!\n` +
          `• *Preço Atual:* R$ ${preco_atual_referencia.toFixed(2)}\n` +
          `• *Variação:* ${variacao_percentual > 0 ? '+' : ''}${variacao_percentual.toFixed(2)}%\n` +
          `• *Recomendação:* ${classificacao_compra.toUpperCase()}\n` +
          `• *Condição monitorada:* ${alerta.tipo_alerta.replace(/_/g, ' ')} ${limiteFormatado}\n\n` +
          `Acesse o painel do Commodities Analytics para mais informações.`;

        let statusEnvio = 'enviado';
        let erroEnvio: string | null = null;

        if (!alerta.usuario.telefone_opcional && canal !== 'email') {
          statusEnvio = 'falha';
          erroEnvio = 'Usuário não possui telefone/chatId cadastrado no sistema';
          this.logger.warn(`User ${alerta.usuario.nome} lacks phone/chatId. Alert delivery failed.`);
        } else {
          try {
            if (canal === 'telegram') {
              const success = await this.telegramService.sendMessage(alerta.usuario.telefone_opcional!, mensagem);
              if (!success) {
                statusEnvio = 'falha';
                erroEnvio = 'Falha no envio da API do Telegram';
              }
            } else if (canal === 'email') {
              const success = await this.emailService.sendMessage(alerta.usuario.email, titulo, mensagem);
              if (!success) {
                statusEnvio = 'falha';
                erroEnvio = 'Falha no envio do email';
              }
            } else {
              this.logger.warn(`Canal de notificação desconhecido: ${canal}. Notificação não enviada.`);
              statusEnvio = 'falha';
              erroEnvio = `Canal desconhecido: ${canal}`;
            }
          } catch (err) {
            statusEnvio = 'falha';
            erroEnvio = err instanceof Error ? err.message : 'Unknown error';
            this.logger.error(`Error sending message: ${erroEnvio}`);
          }
        }

        await this.prisma.notificacao.create({
          data: {
            id_alerta: alerta.id_alerta,
            id_usuario: alerta.id_usuario,
            canal_envio: canal,
            titulo,
            mensagem: mensagem,
            status_envio: statusEnvio,
            erro_envio_opcional: erroEnvio,
            enviado_em: statusEnvio === 'enviado' ? new Date() : null,
          },
        });
      }
    }
  }
}
