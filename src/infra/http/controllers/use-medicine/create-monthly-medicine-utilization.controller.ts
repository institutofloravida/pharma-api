import { CreateMonthlyMedicineUtilizationUseCase } from '@/domain/pharma/application/use-cases/use-medicine/create-monthly-medicine-utilization'
import { Controller, OnApplicationBootstrap } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Controller('create-monthly-medicine-utilization')
export class CreateMonthlyMedicineUtilizationController implements OnApplicationBootstrap {
  constructor(
    private readonly createMonthlyMedicineUtilizationUseCase: CreateMonthlyMedicineUtilizationUseCase,
  ) {
    console.log('✅ CreateMonthlyMedicineUtilizationController carregado.')
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyUsageFromCron() {
    await this.tryGenerate('📆 Cron')
  }

  async onApplicationBootstrap() {
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
