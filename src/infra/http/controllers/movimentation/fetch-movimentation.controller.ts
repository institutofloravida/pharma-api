import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { MovimentationPresenter } from '@/infra/http/presenters/movimentation-presenter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchMovimentationUseCase } from '@/domain/pharma/application/use-cases/movimentation/fetch-movimentation';
import { FetchMovimentationDto } from './dtos/fetch-movimentation.dto';

@ApiTags('movimentation')
@ApiBearerAuth()
@Controller('/movimentation')
export class FetchMovimentationsController {
  constructor(private fetchMovimentation: FetchMovimentationUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMovimentationDto) {
    const { page, institutionId } = queryParams;

    const result = await this.fetchMovimentation.execute({
      page,
      institutionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { movimentation, meta } = result.value;

    return {
      movimentation: movimentation.map(MovimentationPresenter.toHTTP),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    };
  }
}
