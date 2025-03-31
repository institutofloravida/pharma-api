import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchInventoryUseCase } from '@/domain/pharma/application/use-cases/inventory/fetch-inventory'
import { FetchInventoryDto } from './dtos/fetch-inventory.dto'
import { InventoryPresenter } from '../../presenters/prisma-inventory-presenter'

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class FetchInventoryController {
  constructor(private fetchInventory: FetchInventoryUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchInventoryDto) {
    const {
      page,
      stockId,
      medicineName,
      institutionId,
      isLowStock,
      therapeuticClassesIds,
    } = queryParams

    const result = await this.fetchInventory.execute({
      page,
      institutionId,
      stockId,
      medicineName,
      therapeuticClasses: therapeuticClassesIds,
      isLowStock,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { inventory, meta } = result.value

    const inventoryMappedToPresentation = inventory.map(
      InventoryPresenter.toHTTP,
    )

    return {
      inventory: inventoryMappedToPresentation,
      meta,
    }
  }
}
