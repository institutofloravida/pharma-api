import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetInventoryReportUseCase } from '@/domain/pharma/application/use-cases/reports/get-inventory-report';
import { GetInventoryReportDto } from './dtos/get-inventory-report.dto';
import { InventoryPresenter } from '../../presenters/inventory-presenter';
import { GetInventoryReportGroupedUseCase } from '@/domain/pharma/application/use-cases/reports/get-inventory-report-grouped';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('/reports/inventory')
export class GetInventoryReportController {
  constructor(
    private readonly getInventoryReport: GetInventoryReportUseCase,
    private readonly getInventoryReportGrouped: GetInventoryReportGroupedUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: GetInventoryReportDto) {
    const {
      institutionId,
      stockId,
      medicineName,
      isLowStock,
      therapeuticClassesIds,
      group,
      includeBatches,
    } = queryParams;

    if (group) {
      const result = await this.getInventoryReportGrouped.execute({
        institutionId,
        stockId,
        medicineName,
        isLowStock,
        therapeuticClasses: therapeuticClassesIds,
        includeBatches,
      });

      if (result.isLeft()) {
        throw new BadRequestException();
      }

      const { stocks, meta } = result.value;
      return {
        stocks,
        meta,
      };
    }

    const result = await this.getInventoryReport.execute({
      institutionId,
      stockId,
      medicineName,
      isLowStock,
      therapeuticClasses: therapeuticClassesIds,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { inventory, meta } = result.value;
    const inventoryMapped = inventory.map(InventoryPresenter.toHTTP);

    return {
      inventory: inventoryMapped,
      meta,
    };
  }
}
