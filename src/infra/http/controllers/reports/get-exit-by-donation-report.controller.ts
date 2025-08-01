import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { MovimentationPresenter } from '../../presenters/movimentation-presenter'
import { GetExitByDonationUseCase } from '@/domain/pharma/application/use-cases/reports/get-exit-by-donation-report'
import { MedicineExitPresenter } from '../../presenters/medicine-exit-presenter'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('/reports/donation/:exitId')
export class GetDonationReportController {
  constructor(
    private getExitByDonation: GetExitByDonationUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Param('exitId') exitId: string) {
    const result = await this.getExitByDonation.execute({
      exitId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    const { movimentation, exit, meta } = result.value
    const exitsMapped = MedicineExitPresenter.toHTTP(exit)
    const movimentationsMapped = movimentation.map(MovimentationPresenter.toHTTP)
    return {
      movimentation: movimentationsMapped,
      meta,
      exit: exitsMapped,
    }
  }
}
