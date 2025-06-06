import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { PrismaBatchStockMapper } from '../mappers/prisma-batch-stock-mapper'
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Prisma } from 'prisma/generated'
import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaBatchStocksRepository implements BatchStocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(batchStock: BatchStock): Promise<void | null> {
    await this.prisma.batcheStock.create({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
    })
  }

  async save(batchStock: BatchStock): Promise<void | null> {
    const batchStockUpdated = await this.prisma.batcheStock.update({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
      where: {
        id: batchStock.id.toString(),
      },
    })

    if (!batchStockUpdated) {
      return null
    }
  }

  async replenish(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.update({
      data: {
        currentQuantity: { increment: quantity },
      },
      where: {
        id: batchStockId,
      },
    })

    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async subtract(
    batchStockId: string,
    quantity: number,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.update({
      data: {
        currentQuantity: { decrement: quantity },
      },
      where: {
        id: batchStockId,
      },
    })
    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findByBatchIdAndStockId(
    batchId: string,
    stockId: string,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.findFirst({
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
    const batchStock = await this.prisma.batcheStock.findUnique({
      where: {
        id,
      },
    })
    if (!batchStock) {
      return null
    }

    return PrismaBatchStockMapper.toDomain(batchStock)
  }

  async findMany({ page }: PaginationParams, filters: {
    // stockId: string,
    medicineStockId: string
    code?: string,
    includeExpired?: boolean
  }, pagination: boolean = true): Promise<{ batchesStock: BatchStockWithBatch[], meta: Meta }> {
    const { medicineStockId, code, includeExpired } = filters

    const whereClause: Prisma.BatcheStockWhereInput = {
      currentQuantity: { gt: 0 },
      ...(code && {
        batch: {
          code: {
            contains: code,
            mode: 'insensitive',
          },
        },
      }),
      ...(includeExpired === false && {
        batch: {
          expirationDate: { gte: new Date() },
        },
      }),
      medicineStockId,
    }

    const [batchesStock, totalCount] = await this.prisma.$transaction([
      this.prisma.batcheStock.findMany({
        where: whereClause,
        ...(pagination && {
          take: 10,
          skip: (page - 1) * 10,
        }),
        include: {
          stock: true,
          batch: true,
          medicineStock: true,
          medicineVariant: {
            include: {
              medicine: true,
              pharmaceuticalForm: true,
              unitMeasure: true,
            },
          },

        },
        orderBy: {
          batch: {
            expirationDate: 'asc',
          },
        },
      }),
      this.prisma.batcheStock.count({
        where: whereClause,
      }),
    ])

    const batchesStockMapped = batchesStock.map(batchStock => {
      return BatchStockWithBatch.create({
        id: new UniqueEntityId(batchStock.id),
        batch: batchStock.batch.code,
        batchId: new UniqueEntityId(batchStock.batchId),
        medicine: batchStock.medicineVariant.medicine.name,
        medicineStockId: new UniqueEntityId(batchStock.medicineStockId),
        medicineVariantId: new UniqueEntityId(batchStock.medicineVariantId),
        pharmaceuticalForm: batchStock.medicineVariant.pharmaceuticalForm.name,
        stockId: new UniqueEntityId(batchStock.stockId),
        stock: batchStock.stock.name,
        unitMeasure: batchStock.medicineVariant.unitMeasure.acronym,
        dosage: batchStock.medicineVariant.dosage,
        expirationDate: batchStock.batch.expirationDate,
        currentQuantity: batchStock.currentQuantity,
        createdAt: batchStock.createdAt,
        updatedAt: batchStock.updatedAt,

      })
    })
    return {
      batchesStock: batchesStockMapped,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
