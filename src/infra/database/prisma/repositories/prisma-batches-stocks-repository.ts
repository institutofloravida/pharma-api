import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock';
import { PrismaBatchStockMapper } from '../mappers/prisma-batch-stock-mapper';
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Prisma } from 'prisma/generated';
import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaBatchMapper } from '../mappers/prisma-batch-mapper';

@Injectable()
export class PrismaBatchStocksRepository implements BatchStocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(batchStock: BatchStock): Promise<void | null> {
    await this.prisma.batcheStock.create({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
    });
  }

  async save(batchStock: BatchStock): Promise<void | null> {
    const batchStockUpdated = await this.prisma.batcheStock.update({
      data: PrismaBatchStockMapper.toPrisma(batchStock),
      where: {
        id: batchStock.id.toString(),
      },
    });

    if (!batchStockUpdated) {
      return null;
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
    });

    return PrismaBatchStockMapper.toDomain(batchStock);
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
    });
    return PrismaBatchStockMapper.toDomain(batchStock);
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
    });

    if (!batchStock) {
      return null;
    }

    return PrismaBatchStockMapper.toDomain(batchStock);
  }

  async findById(id: string): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.findUnique({
      where: {
        id,
      },
    });
    if (!batchStock) {
      return null;
    }

    return PrismaBatchStockMapper.toDomain(batchStock);
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      medicineStockId: string;
      code?: string;
      includeExpired?: boolean;
      includeZero?: boolean;
    },
    pagination: boolean = true,
  ): Promise<{ batchesStock: BatchStockWithBatch[]; meta: Meta }> {
    const { medicineStockId, code, includeExpired, includeZero } = filters;

    const whereClause: Prisma.BatcheStockWhereInput = {
      currentQuantity: includeZero === true ? { gte: 0 } : { gt: 0 },
      ...(code && {
        batch: {
          code: {
            contains: code,
            mode: 'insensitive',
          },
        },
      }),
      ...(!includeExpired && {
        batch: {
          expirationDate: { gte: new Date() },
        },
      }),

      medicineStockId: { equals: medicineStockId },
    };

    const [batchesStock, totalCount] = await this.prisma.$transaction([
      this.prisma.batcheStock.findMany({
        where: whereClause,
        ...(pagination && {
          take: 10,
          skip: (page - 1) * 10,
        }),
        select: {
          id: true,
          batchId: true,
          medicineStockId: true,
          medicineVariantId: true,
          stockId: true,
          createdAt: true,
          currentQuantity: true,
          updatedAt: true,
          stock: {
            select: {
              name: true,
            },
          },
          batch: {
            select: {
              manufacturingDate: true,
              id: true,
              code: true,
              expirationDate: true,
              manufacturer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          medicineVariant: {
            select: {
              dosage: true,
              medicine: {
                select: {
                  name: true,
                },
              },
              pharmaceuticalForm: {
                select: {
                  name: true,
                },
              },
              unitMeasure: {
                select: { acronym: true },
              },
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
    ]);

    const batchesStockMapped = batchesStock.map((batchStock) => {
      const batch = PrismaBatchMapper.toDomain({
        code: batchStock.batch.code,
        expirationDate: batchStock.batch.expirationDate,
        id: batchStock.batch.id,
        manufacturerId: batchStock.batch.manufacturer.id,
        createdAt: batchStock.createdAt,
        updatedAt: batchStock.updatedAt,
        manufacturingDate: batchStock.batch.manufacturingDate,
      });

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
        manufacturer: batchStock.batch.manufacturer.name,
        unitMeasure: batchStock.medicineVariant.unitMeasure.acronym,
        dosage: batchStock.medicineVariant.dosage,
        expirationDate: batchStock.batch.expirationDate,
        currentQuantity: batchStock.currentQuantity,
        isAvailable: !batch.isExpired(),
        isCloseToExpiration: batch.isCloseToExpiration(),
        isExpired: batch.isExpired(),
        createdAt: batchStock.createdAt,
        updatedAt: batchStock.updatedAt,
      });
    });
    return {
      batchesStock: batchesStockMapped,
      meta: {
        page,
        totalCount,
      },
    };
  }

  async exists(
    code: string,
    manufacturerId: string,
    stockId: string,
  ): Promise<BatchStock | null> {
    const batchStock = await this.prisma.batcheStock.findFirst({
      where: {
        batch: {
          code,
          manufacturerId,
        },
        stockId,
      },
    });

    if (!batchStock) {
      return null;
    }

    return PrismaBatchStockMapper.toDomain(batchStock);
  }
}
