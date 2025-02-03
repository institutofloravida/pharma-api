import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { CreateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/create-stock'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { CreateStockDTO } from './dtos/create-stock.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InstitutionNotExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-not-exists-error'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class CreateStockController {
  constructor(
    private createStock: CreateStockUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateStockDTO) {
    const { name, status, institutionId } = body
    const result = await this.createStock.execute({
      content: name,
      institutionId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InstitutionNotExistsError:
          throw new ResourceNotFoundError()
        default:
          throw new BadRequestException(error.message)
      }
    }
    return { stock: result.value.stock }
  }
}
