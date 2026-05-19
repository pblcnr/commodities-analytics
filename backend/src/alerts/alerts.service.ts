import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AlertModel {
  id: string;
  commodityName: string;
  condition: string;
  channel: string;
  active: boolean;
}

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AlertModel[]> {
    const alertas = await this.prisma.alerta.findMany({
      include: {
        materia_prima: true,
        usuario: true,
      },
    });

    return alertas.map(alerta => ({
      id: String(alerta.id_alerta),
      commodityName: alerta.materia_prima?.nome || 'Desconhecida',
      condition: alerta.valor_limite_opcional 
        ? `${alerta.tipo_alerta} R$ ${alerta.valor_limite_opcional}` 
        : alerta.tipo_alerta,
      channel: alerta.usuario?.canal_notificacao_preferido || 'email',
      active: alerta.ativo ?? true,
    }));
  }

  async toggleStatus(id: string): Promise<AlertModel> {
    const alertId = parseInt(id, 10);
    const existing = await this.prisma.alerta.findUnique({ where: { id_alerta: alertId } });
    if (!existing) {
      throw new NotFoundException(`Alerta com id ${id} não encontrado`);
    }

    const updated = await this.prisma.alerta.update({
      where: { id_alerta: alertId },
      data: { ativo: !existing.ativo },
      include: { materia_prima: true, usuario: true }
    });

    return {
      id: String(updated.id_alerta),
      commodityName: updated.materia_prima?.nome || 'Desconhecida',
      condition: updated.valor_limite_opcional 
        ? `${updated.tipo_alerta} R$ ${updated.valor_limite_opcional}` 
        : updated.tipo_alerta,
      channel: updated.usuario?.canal_notificacao_preferido || 'email',
      active: updated.ativo ?? true,
    };
  }

  async remove(id: string): Promise<void> {
    const alertId = parseInt(id, 10);
    await this.prisma.alerta.delete({
      where: { id_alerta: alertId }
    });
  }
}
