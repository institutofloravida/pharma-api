import { BadRequestException, Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { DispensationPreviewUseCase } from '@/domain/pharma/application/use-cases/dispensation/dispensation-preview'
import { DispensationPreviewDto } from './dtos/dispensation-preview.dto'
import { MedicineStockNotFoundError } from '@/domain/pharma/application/use-cases/stock/medicine-stock/_errors/medicine-stock-not-found-error'

@ApiTags('dispensation')
@ApiBearerAuth()
@Controller('/dispensation/preview')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.COMMON)
export class DispensationPreviewController {
  constructor(
    private dispensationPreview: DispensationPreviewUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query() queryParams: DispensationPreviewDto,
  ) {
    const { medicineStockId, quantityRequired } = queryParams
    const result = await this.dispensationPreview.execute({
      medicineStockId,
      quantityRequired,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case MedicineStockNotFoundError:
          throw new ResourceNotFoundError()
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { batchesPreview } = result.value

    return {
      dispensationPreview: batchesPreview,
    }
  }
}
