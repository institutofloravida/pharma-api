import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchMostTreatedPathologiesUseCase } from '@/domain/pharma/application/use-cases/metrics/fetch-most-treated-pathologies'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/charts/most-treated-pathologies')
export class FetchMostTreatedPathologiesController {
  constructor(private fetchMostTreatedPathologies: FetchMostTreatedPathologiesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('institutionId') institutionId : string) {
    const result = await this.fetchMostTreatedPathologies.execute({
      institutionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { mostTreatedPathologies } = result.value

    return {
      mostTreatedPathologies,
    }
  }
}
