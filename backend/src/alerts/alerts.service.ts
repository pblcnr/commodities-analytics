import { Injectable, NotFoundException } from '@nestjs/common';

export interface AlertModel {
  id: string;
  commodityName: string;
  condition: string;
  channel: string;
  active: boolean;
}

@Injectable()
export class AlertsService {
  private mockAlerts: AlertModel[] = [
    {
      id: '1',
      commodityName: 'Milho',
      condition: 'Preço cair abaixo de R$ 50,00',
      channel: 'Telegram',
      active: true,
    },
    {
      id: '2',
      commodityName: 'Soja',
      condition: 'Recomendação mudar para BOM',
      channel: 'Telegram',
      active: true,
    },
  ];

  findAll(): AlertModel[] {
    return this.mockAlerts;
  }

  toggleStatus(id: string): AlertModel {
    const alert = this.mockAlerts.find((a) => a.id === id);
    if (!alert) {
      throw new NotFoundException(`Alerta com id ${id} não encontrado`);
    }
    alert.active = !alert.active;
    return alert;
  }

  remove(id: string): void {
    this.mockAlerts = this.mockAlerts.filter((a) => a.id !== id);
  }
}
