import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FetchMedicinesExitsUseCase } from '@/domain/pharma/application/use-cases/movimentation/exit/fetch-exits'
import { FetchMedicinesExitsDto } from './dtos/fetch-medicines-exits.dto'
import { MedicineExitPresenter } from '@/infra/http/presenters/medicine-exit-presenter'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
@ApiBearerAuth()
@ApiTags('exit')
@Controller('/movement/exit')
export class FetchMedicinesExitsController {
  constructor(private fetchMedicinesExits: FetchMedicinesExitsUseCase) {}

  @Get()
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
  async handle(@Query() queryParams: FetchMedicinesExitsDto) {
    const {
      institutionId,
      page,
      operatorId,
      exitDate,
    } = queryParams

    const result = await this.fetchMedicinesExits.execute({
      page,
      institutionId,
      operatorId,
      exitDate: exitDate
        ? new Date(exitDate)
        : undefined,
      exitType: undefined,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { medicinesExits, meta } = result.value

    return {
      medicines_exits: medicinesExits.map(
        MedicineExitPresenter.toHTTP,
      ),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    }
  }
}
