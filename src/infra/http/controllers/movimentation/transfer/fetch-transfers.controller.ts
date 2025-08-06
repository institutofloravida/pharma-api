import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/role-decorator';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { FetchTransfersUseCase } from '@/domain/pharma/application/use-cases/movimentation/transfer/fetch-transfers';
import { FetchTransfersDto } from './dtos/fetch-transfers.dto';
import { TransferPresenter } from '@/infra/http/presenters/transfer-presenter';
@ApiBearerAuth()
@ApiTags('transfer')
@Controller('/movement/transfer')
export class FetchTransfersController {
  constructor(private fetchTransfers: FetchTransfersUseCase) {}

  @Get()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
  async handle(@Query() queryParams: FetchTransfersDto) {
    const { institutionId, page, operatorId, transferDate, status } =
      queryParams;

    const result = await this.fetchTransfers.execute({
      page,
      institutionId,
      operatorId,
      transferDate: transferDate ? new Date(transferDate) : undefined,
      status,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { transfers, meta } = result.value;

    return {
      transfers: transfers.map(TransferPresenter.toHTTP),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    };
  }
}
