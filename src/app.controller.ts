import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('ready')
  @HealthCheck()
  readinessCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
