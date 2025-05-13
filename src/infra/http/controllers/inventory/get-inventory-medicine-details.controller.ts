import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMedicineInventoryDetailsUseCase } from '@/domain/pharma/application/use-cases/inventory/get-medicine-inventory'
import { InventoryMedicineDetailsPresenter } from '../../presenters/inventory-medicine-details-presenter'

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class GetInventoryMedicineDetailsController {
  constructor(private getInventoryMedicineDetails: GetMedicineInventoryDetailsUseCase) {}

  @Get(':medicineStockId')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('medicineStockId') medicineStockId: string) {
    const result = await this.getInventoryMedicineDetails.execute({
      medicineStockId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { medicineStockInventory } = result.value
    console.log(medicineStockInventory)
    return {
      inventory: InventoryMedicineDetailsPresenter.toHTTP(medicineStockInventory),
    }
  }
}
