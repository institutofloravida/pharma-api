import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { PrismaBatchStockMapper } from '../mappers/prisma-batch-stock-mapper'
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'

@Injectable()
export class PrismaBatchStocksRepository implements BatchStocksRepository {
  constructor(
    private prisma: PrismaService,
    private medicinesStockRepository: MedicinesStockRepository,
  ) {}

  async create(batchStock: BatchStock): Promise<void | null> {
    const medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        batchStock.medicineVariantId.toString(),
        batchStock.stockId.toString(),
      )

    if (!medicineStock) {
      return null
    }
    await Promise.all([
      this.prisma.batchestock.create({
        data: PrismaBatchStockMapper.toPrisma(batchStock),
      }),
      this.medicinesStockRepository.replenish(
        medicineStock?.id.toString(),
        batchStock.quantity,
      ),
    ])
  }

  async save(batchStock: BatchStock): Promise<void | null> {
    const batchStockUpdated = await this.prisma.batchestock.update({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
      where: {
        id: batchStock.id.toString(),
      },
    })

    if (!batchStockUpdated) {
      return null
    }

    const medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        batchStock.medicineVariantId.toString(),
        batchStock.stockId.toString(),
      )

    if (!medicineStock) {
      return null
    }

    await this.medicinesStockRepository.replenish(
      medicineStock.id.toString(),
      batchStock.quantity,
    )
  }

  async replenish(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batchestock.update({
      data: {
        currentQuantity: { increment: quantity },
      },
      where: {
        id: batchStockId,
      },
    })
    const medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        batchStock.medicineVariantId,
        batchStock.stockId,
      )

    if (!medicineStock) {
      return null
    }

    await this.medicinesStockRepository.replenish(
      medicineStock.id.toString(),
      quantity,
    )
    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async subtract(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batchestock.update({
      data: {
        currentQuantity: { decrement: quantity },
      },
      where: {
        id: batchStockId,
      },
    })
    const medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        batchStock.medicineVariantId,
        batchStock.stockId,
      )

    if (!medicineStock) {
      return null
    }

    await this.medicinesStockRepository.subtract(
      medicineStock.id.toString(),
      quantity,
    )
    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findByBatchIdAndStockId(
    batchId: string,
    stockId: string,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batchestock.findFirst({
      where: {
        batchId,
        stockId,
      },
    })

    if (!batchStock) {
      return null
    }

    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findById(id: string): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batchestock.findUnique({
      where: {
        id,
      },
    })
    if (!batchStock) {
      return null
    }

    return PrismaBatchStockMapper.toDomain(batchStock)
  }
}
