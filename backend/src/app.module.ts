import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CommoditiesModule } from './commodities/commodities.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { AlertsModule } from './alerts/alerts.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, PrismaModule, CommoditiesModule, EnterpriseModule, AlertsModule, IntegrationsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
