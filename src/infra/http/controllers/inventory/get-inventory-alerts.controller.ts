import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetInventoryAlertsUseCase } from '@/domain/pharma/application/use-cases/metrics/get-inventory-alerts'

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory-alerts')
@UseGuards(JwtAuthGuard)
export class GetInventoryAlertsController {
  constructor(private getInventoryAlerts: GetInventoryAlertsUseCase) {}

  @Get()
  async handle(@Query('institutionId') institutionId: string) {
    if (!institutionId) {
      throw new BadRequestException('institutionId is required')
    }

    const result = await this.getInventoryAlerts.execute({ institutionId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    return result.value
  }
}
