import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { 
  HealthCheck, 
  HealthCheckService, 
  MongooseHealthIndicator, 
} from '@nestjs/terminus';

@Controller("health")
export class HealthController {
  constructor(
    private readonly health : HealthCheckService,
    private readonly db : MongooseHealthIndicator,
  ) {}

  @Get("check")
  @HealthCheck()
  @ApiOperation({summary : "check"})
  check() {
    return this.health.check([
      async () => this.db.pingCheck('database' , {timeout : 300})
    ])
  }

}