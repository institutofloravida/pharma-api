import { CreateMonthlyMedicineUtilizationUseCase } from '@/domain/pharma/application/use-cases/use-medicine/create-monthly-medicine-utilization'
import { EnvService } from '@/infra/env/env.service'
import { Controller, OnApplicationBootstrap } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Controller('create-monthly-medicine-utilization')
export class CreateMonthlyMedicineUtilizationController implements OnApplicationBootstrap {
  constructor(
    private readonly createMonthlyMedicineUtilizationUseCase: CreateMonthlyMedicineUtilizationUseCase,
    private readonly env: EnvService,
  ) {
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyUsageFromCron() {
    await this.tryGenerate('📆 Cron')
  }

  async onApplicationBootstrap() {
    if (this.env.get('NODE_ENV') === 'TEST') {
      return
    }

    await this.tryGenerate('🚀 Startup')
  }

  private async tryGenerate(source: string) {
    const result = await this.createMonthlyMedicineUtilizationUseCase.execute({})

    if (result.isRight()) {
      console.log(`${source} → 📊 Relatório mensal de medicamentos gerado com sucesso.`)
    } else {
      console.warn(`${source} → ⚠️ Relatório já existia — não foi gerado novamente.`)
    }
  }
}
