// src/test-schedule.controller.ts
import { Controller, Get } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Controller('test-schedule')
export class TestScheduleController {
  constructor() {
    console.log('✅ TestScheduleController carregado.')
  }

  @Get()
  hello() {
    return '✅ Cron ativo — veja o console rodando a cada 10s'
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('⏰ Rodando CRON a cada 10 segundos:', new Date().toISOString())
  }
}
