import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/create-pathology'
import { PathologyPresenter } from '@/infra/http/presenters/pathology-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreatePathologyDTO } from './dtos/create-pathology.dto'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathology')

@UseGuards(JwtAuthGuard)
export class CreatePathologyController {
  constructor(
    private createPathology: CreatePathologyUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreatePathologyDTO) {
    const { name } = body

    const result = await this.createPathology.execute({
      content: name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { pathology: PathologyPresenter.toHTTP(result.value.pathology) }
  }
}
