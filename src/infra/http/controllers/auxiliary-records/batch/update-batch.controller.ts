import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateBatchDto } from './dtos/update-batch.dto'
import { UpdateBatchUseCase } from '@/domain/pharma/application/use-cases/stock/batch/update-batch'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { BatchAlreadyExistsError } from '@/domain/pharma/application/use-cases/stock/batch/_errors/batch-already-exists-error'

@ApiTags('Batches')
@ApiBearerAuth()
@Controller('/batches')
export class UpdateBatchController {
  constructor(private updateBatch: UpdateBatchUseCase) {}

  @Put('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') batchId: string, @Body() body: UpdateBatchDto) {
    const { code, expirationDate, manufacturingDate } = body

    const result = await this.updateBatch.execute({
      batchId,
      code,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      manufacturingDate:
        manufacturingDate !== undefined
          ? manufacturingDate
            ? new Date(manufacturingDate)
            : null
          : undefined,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case BatchAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
