import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTransferUseCase } from '@/domain/pharma/application/use-cases/movimentation/transfer/get-transfer';
import { TransferWithMovimentationPresenter } from '@/infra/http/presenters/transfer-with-movimentation-presenter';

@ApiTags('transfer')
@ApiBearerAuth()
@Controller('/movement/transfer')
export class GetTransferDetailsController {
  constructor(private getTransfer: GetTransferUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getTransfer.execute({
      transferId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { transfer } = result.value;

    return {
      transfer: TransferWithMovimentationPresenter.toHTTP(transfer),
    };
  }
}
