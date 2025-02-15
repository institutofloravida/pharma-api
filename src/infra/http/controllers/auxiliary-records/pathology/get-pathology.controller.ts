import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PathologyPresenter } from '../../../presenters/pathology-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetPathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/get-pathology'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathology')
export class GetPathologyController {
  constructor(private getPathology: GetPathologyUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getPathology.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const pathology = result.value

    return {
      pathology: PathologyPresenter.toHTTP(pathology),
    }
  }
}
