import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { GetExitDetailsUseCase } from '@/domain/pharma/application/use-cases/movimentation/exit/get-exit-details';
import { ExitDetailsPresenter } from '@/infra/http/presenters/exit-details-presenter';
@ApiTags('exit')
@Controller('/exit')
export class GetExitDetailsController {
  constructor(private getexitDetails: GetExitDetailsUseCase) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getexitDetails.execute({
      exitId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { exit } = result.value;

    return {
      exitDetails: ExitDetailsPresenter.toHTTP(exit),
    };
  }
}
