import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository';
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock';
import { PrismaMedicineStockMapper } from '../mappers/prisma-medicine-stock-mapper';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details';
import { Prisma } from 'prisma/generated';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory';
import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details';
import { PrismaBatchMapper } from '../mappers/prisma-batch-mapper';

@Injectable()
export class PrismaMedicinesStockRepository
  implements MedicinesStockRepository
{
  constructor(private prisma: PrismaService) {}

  async create(medicineStock: MedicineStock): Promise<void> {
    await this.prisma.medicineStock.create({
      data: PrismaMedicineStockMapper.toPrisma(medicineStock),
    });
  }

  async save(medicinestock: MedicineStock): Promise<void | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicinestock.id.toString(),
      },
      data: PrismaMedicineStockMapper.toPrisma(medicinestock),
    });

    if (!medicineStock) {
      return null;
    }
  }

  async addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null> {
    await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        batchesStocks: {
          connect: {
            id: batchStockId,
          },
        },
      },
    });
  }

  async replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        currentQuantity: { increment: quantity },
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!medicineStock) {
      return null;
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock);
  }

  async subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: {
        currentQuantity: { decrement: quantity },
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!medicineStock) {
      return null;
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock);
  }

  async findById(id: string): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.findUnique({
      where: {
        id,
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!medicineStock) {
      return null;
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock);
  }

  async findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.prisma.medicineStock.findFirst({
      where: {
        medicineVariantId,
        stockId,
      },
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!medicineStock) {
      return null;
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock);
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicinesStock = await this.prisma.medicineStock.findMany({
      where: {
        medicineVariantId: medicineStock.medicineVariantId.toString(),
        stockId: medicineStock.stockId.toString(),
      },
    });

    if (medicinesStock.length > 1) {
      return null;
    }

    return medicineStock;
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      stockId: string;
      medicineName?: string;
      medicineVariantId?: string;
    },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }> {
    const { stockId, medicineName, medicineVariantId } = filters;

    const whereClause: Prisma.MedicineStockWhereInput = {
      stockId,
      medicineVariant: {
        ...(medicineVariantId && {
          id: medicineVariantId,
        }),
        medicine: {
          name: {
            contains: medicineName ?? '',
            mode: 'insensitive',
          },
        },
      },
    };

    const [medicinesStock, totalCount] = await this.prisma.$transaction([
      this.prisma.medicineStock.findMany({
        where: whereClause,
        include: {
          medicineVariant: {
            include: {
              medicine: true,
              pharmaceuticalForm: true,
              unitMeasure: true,
            },
          },
          stock: true,
        },
        skip: (page - 1) * 10,
        take: 10,
      }),
      this.prisma.medicineStock.count({
        where: whereClause,
      }),
    ]);

    const medicinesStockMapped = await Promise.all(
      medicinesStock.map(async (medicineStock) => {
        const totalQuantityBatchesOnStockExpired =
          await this.prisma.batcheStock.aggregate({
            where: {
              medicineStockId: medicineStock.id,
              medicineStock: {
                currentQuantity: { gt: 0 },
              },
              currentQuantity: { gt: 0 },
              batch: {
                expirationDate: {
                  lte: new Date(),
                },
              },
            },
            _sum: {
              currentQuantity: true,
            },
          });

        return MedicineStockDetails.create({
          id: new UniqueEntityId(medicineStock.id),
          dosage: medicineStock.medicineVariant.dosage,
          medicine: medicineStock.medicineVariant.medicine.name,
          complement: medicineStock.medicineVariant.complement ?? undefined,
          pharmaceuticalForm:
            medicineStock.medicineVariant.pharmaceuticalForm.name,
          stock: medicineStock.stock.name,
          unitMeasure: medicineStock.medicineVariant.unitMeasure.acronym,
          quantity: {
            totalCurrent: medicineStock.currentQuantity,
            unavailable:
              totalQuantityBatchesOnStockExpired._sum.currentQuantity ?? 0,
            available:
              medicineStock.currentQuantity -
              (totalQuantityBatchesOnStockExpired._sum.currentQuantity ?? 0),
          },
          medicineVariantId: new UniqueEntityId(
            medicineStock.medicineVariantId,
          ),
          stockId: new UniqueEntityId(medicineStock.stockId),
          createdAt: medicineStock.createdAt,
          updatedAt: medicineStock.updatedAt,
        });
      }),
    );

    return {
      medicinesStock: medicinesStockMapped,
      meta: {
        page,
        totalCount,
      },
    };
  }

  async fetchInventory(
    pagination: PaginationParams | null,
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isCloseToExpiring?: boolean;
      isLowStock?: boolean;
    },
  ): Promise<{ inventory: MedicineStockInventory[]; meta: Meta }> {
    const page = pagination?.page ?? 1;
    const perPage = pagination?.perPage ?? 10;
    const { isLowStock, medicineName, stockId, therapeuticClasses } = filters;
    const whereClause: Prisma.MedicineStockWhereInput = {
      stock: {
        institution: {
          id: institutionId,
        },
      },
      ...(isLowStock && {
        currentQuantity: {
          lt: this.prisma.medicineStock.fields.minimumLevel,
        },
      }),
      ...(stockId && { stockId }),
      medicineVariant: {
        medicine: {
          name: {
            contains: medicineName ?? '',
            mode: 'insensitive',
          },
          ...(therapeuticClasses && {
            therapeuticClasses: {
              some: {
                id: { in: therapeuticClasses },
              },
            },
          }),
        },
      },
    };

    const skip = pagination ? (page - 1) * perPage : undefined;
    const take = pagination ? perPage : undefined;

    const [inventory, totalCount] = await this.prisma.$transaction([
      this.prisma.medicineStock.findMany({
        where: whereClause,
        orderBy: {
          medicineVariant: {
            medicine: {
              name: 'asc',
            },
          },
        },
        include: {
          stock: {
            select: {
              id: true,
              name: true,
            },
          },
          medicineVariant: {
            include: {
              pharmaceuticalForm: true,
              unitMeasure: true,
              medicine: true,
            },
          },
          batchesStocks: {
            where: {
              currentQuantity: {
                gt: 0,
              },
            },
            select: {
              id: true,
            },
          },
        },
        skip,
        take,
      }),
      this.prisma.medicineStock.count({
        where: whereClause,
      }),
    ]);

    const inventoryMaped = await Promise.all(
      inventory.map(async (medicineStock) => {
        const totalQuantityBatchesOnStockExpired =
          await this.prisma.batcheStock.aggregate({
            where: {
              medicineStockId: medicineStock.id,
              medicineStock: {
                currentQuantity: { gt: 0 },
              },
              currentQuantity: { gt: 0 },
              batch: {
                expirationDate: {
                  lte: new Date(),
                },
              },
            },
            _sum: {
              currentQuantity: true,
            },
          });
        return MedicineStockInventory.create({
          stockId: new UniqueEntityId(medicineStock.stock.id),
          minimumLevel: medicineStock.minimumLevel,
          dosage: medicineStock.medicineVariant.dosage,
          unitMeasure: medicineStock.medicineVariant.unitMeasure.acronym,
          medicine: medicineStock.medicineVariant.medicine.name,
          complement: medicineStock.medicineVariant.complement ?? undefined,
          pharmaceuticalForm:
            medicineStock.medicineVariant.pharmaceuticalForm.name,
          quantity: {
            current: medicineStock.currentQuantity,
            available:
              medicineStock.currentQuantity -
              (totalQuantityBatchesOnStockExpired._sum.currentQuantity ?? 0),
            unavailable:
              totalQuantityBatchesOnStockExpired._sum.currentQuantity ?? 0,
          },
          stock: medicineStock.stock.name,
          medicineStockId: new UniqueEntityId(medicineStock.id),
          medicineVariantId: new UniqueEntityId(
            medicineStock.medicineVariant.id,
          ),
          batchesStockIds: medicineStock.batchesStocks.map(
            (item) => new UniqueEntityId(item.id),
          ),
        });
      }),
    );

    return {
      inventory: inventoryMaped,
      meta: {
        page,
        totalCount,
      },
    };
  }

  async getInventoryByMedicineStockId(
    medicineStockid: string,
  ): Promise<MedicineStockInventoryDetails | null> {
    const inventory = await this.prisma.medicineStock.findUnique({
      where: {
        id: medicineStockid,
      },
      include: {
        stock: {
          select: {
            id: true,
            name: true,
          },
        },
        batchesStocks: {
          where: {
            currentQuantity: { gt: 0 },
          },
          select: {
            id: true,
            currentQuantity: true,
            batch: {
              include: {
                manufacturer: true,
              },
            },
          },
          orderBy: {
            batch: {
              expirationDate: 'asc',
            },
          },
        },
        medicineVariant: {
          select: {
            complement: true,
            dosage: true,
            unitMeasure: {
              select: {
                acronym: true,
              },
            },
            pharmaceuticalForm: true,
            medicine: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const [medicineStockTotalCurrent, medicineStockUnavailable] =
      await this.prisma.$transaction([
        this.prisma.batcheStock.aggregate({
          where: {
            medicineStockId: medicineStockid,
            currentQuantity: { gt: 0 },
          },
          _sum: {
            currentQuantity: true,
          },
        }),
        this.prisma.batcheStock.aggregate({
          where: {
            medicineStockId: medicineStockid,
            currentQuantity: { gt: 0 },
            batch: {
              expirationDate: {
                lt: new Date(),
              },
            },
          },
          _sum: {
            currentQuantity: true,
          },
        }),
      ]);
    const totalCurrent = medicineStockTotalCurrent._sum.currentQuantity
      ? medicineStockTotalCurrent._sum.currentQuantity
      : 0;
    const unavailable = medicineStockUnavailable._sum.currentQuantity
      ? medicineStockUnavailable._sum.currentQuantity
      : 0;

    if (!inventory) {
      return null;
    }

    const batchesStock = inventory.batchesStocks.map((batchStock) => {
      const batch = PrismaBatchMapper.toDomain(batchStock.batch);

      return {
        id: new UniqueEntityId(batchStock.id),
        code: batch.code,
        quantity: batchStock.currentQuantity,
        expirationDate: batch.expirationDate,
        manufacturingDate: batch.manufacturingDate,
        manufacturer: batchStock.batch.manufacturer.name,
        isCloseToExpiration: batch.isCloseToExpiration(),
        isExpired: batch.isExpired(),
      };
    });

    return MedicineStockInventoryDetails.create({
      medicineStockId: new UniqueEntityId(inventory.id),
      dosage: inventory.medicineVariant.dosage,
      stock: inventory.stock.name,
      unitMeasure: inventory.medicineVariant.unitMeasure.acronym,
      pharmaceuticalForm: inventory.medicineVariant.pharmaceuticalForm.name,
      minimumLevel: inventory.minimumLevel,
      complement: inventory.medicineVariant.complement ?? undefined,
      medicine: inventory.medicineVariant.medicine.name,
      stockId: new UniqueEntityId(inventory.stockId),
      quantity: {
        totalCurrent,
        available: totalCurrent - unavailable,
        unavailable,
      },
      batchesStock,
    });
  }

  async fetchInventoryReportGrouped(
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isLowStock?: boolean;
    },
    options?: {
      includeBatches?: boolean;
    },
  ): Promise<{
    stocks: Array<{
      stockId: string;
      stock: string;
      medicines: Array<{
        medicineId: string;
        medicine: string;
        medicineStocks: Array<{
          medicineStockId: string;
          medicineVariantId: string;
          pharmaceuticalForm: string;
          unitMeasure: string;
          dosage: string;
          complement?: string;
          minimumLevel: number;
          quantity: { current: number; available: number; unavailable: number };
          batchesStocks?: Array<{
            id: string;
            code: string;
            currentQuantity: number;
            manufacturer: string;
            expirationDate: Date;
            manufacturingDate: Date | null;
            isCloseToExpiration: boolean;
            isExpired: boolean;
          }>;
        }>;
      }>;
    }>;
    meta: Meta;
  }> {
    const { stockId, medicineName, therapeuticClasses, isLowStock } = filters;
    const includeBatches = options?.includeBatches ?? false;

    const whereClause: Prisma.MedicineStockWhereInput = {
      stock: { institutionId },
      ...(stockId && { stockId }),
      ...(isLowStock && {
        currentQuantity: { lt: this.prisma.medicineStock.fields.minimumLevel },
      }),
      medicineVariant: {
        medicine: {
          name: {
            contains: medicineName ?? '',
            mode: 'insensitive',
          },
          ...(therapeuticClasses && {
            therapeuticClasses: {
              some: { id: { in: therapeuticClasses } },
            },
          }),
        },
      },
    };

    const inventory = await this.prisma.medicineStock.findMany({
      where: whereClause,
      orderBy: [
        {
          stock: { name: 'asc' },
        },
        {
          medicineVariant: { medicine: { name: 'asc' } },
        },
      ],
      include: {
        stock: {
          select: { id: true, name: true },
        },
        medicineVariant: {
          include: {
            pharmaceuticalForm: true,
            unitMeasure: true,
            medicine: true,
          },
        },
        // We'll fetch batches in a separate query per medicineStock when requested,
        // to avoid type unions that drop relation typing.
        batchesStocks: false,
      },
    });

    // compute quantities with expired batches using aggregate per medicineStock
    const resultMap = new Map<
      string,
      {
        stockId: string;
        stock: string;
        medicines: Map<
          string,
          {
            medicineId: string;
            medicine: string;
            medicineStocks: Array<{
              medicineStockId: string;
              medicineVariantId: string;
              pharmaceuticalForm: string;
              unitMeasure: string;
              dosage: string;
              complement?: string;
              minimumLevel: number;
              quantity: {
                current: number;
                available: number;
                unavailable: number;
              };
              batchesStocks?: Array<{
                id: string;
                code: string;
                currentQuantity: number;
                manufacturer: string;
                expirationDate: Date;
                manufacturingDate: Date | null;
                isCloseToExpiration: boolean;
                isExpired: boolean;
              }>;
            }>;
          }
        >;
      }
    >();

    // For performance, when includeBatches=false, compute unavailable via aggregate
    for (const ms of inventory) {
      const stockKey = ms.stock.id;
      if (!resultMap.has(stockKey)) {
        resultMap.set(stockKey, {
          stockId: ms.stock.id,
          stock: ms.stock.name,
          medicines: new Map(),
        });
      }
      const stockEntry = resultMap.get(stockKey)!;
      const medicineKey = ms.medicineVariant.medicine.id;
      if (!stockEntry.medicines.has(medicineKey)) {
        stockEntry.medicines.set(medicineKey, {
          medicineId: ms.medicineVariant.medicine.id,
          medicine: ms.medicineVariant.medicine.name,
          medicineStocks: [],
        });
      }
      const medicineEntry = stockEntry.medicines.get(medicineKey)!;

      let expiredSum = 0;
      if (includeBatches) {
        // fetch batchesStocks with batch relation for this medicineStock
        const batchesWithBatch = await this.prisma.batcheStock.findMany({
          where: {
            medicineStockId: ms.id,
            currentQuantity: { gt: 0 },
          },
          include: {
            batch: {
              include: { manufacturer: true },
            },
          },
        });
        const batches = batchesWithBatch.map((bs) => {
          const isExpired = bs.batch.expirationDate <= new Date();
          const isCloseToExpiration =
            bs.batch.expirationDate > new Date() &&
            bs.batch.expirationDate <=
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          if (isExpired) expiredSum += bs.currentQuantity;
          return {
            id: bs.id,
            code: bs.batch.code,
            currentQuantity: bs.currentQuantity,
            manufacturer: bs.batch.manufacturer.name,
            expirationDate: bs.batch.expirationDate,
            manufacturingDate: bs.batch.manufacturingDate,
            isCloseToExpiration,
            isExpired,
          };
        });

        medicineEntry.medicineStocks.push({
          medicineStockId: ms.id,
          medicineVariantId: ms.medicineVariant.id,
          pharmaceuticalForm: ms.medicineVariant.pharmaceuticalForm.name,
          unitMeasure: ms.medicineVariant.unitMeasure.acronym,
          dosage: ms.medicineVariant.dosage,
          complement: ms.medicineVariant.complement ?? undefined,
          minimumLevel: ms.minimumLevel,
          quantity: {
            current: ms.currentQuantity,
            available: ms.currentQuantity - expiredSum,
            unavailable: expiredSum,
          },
          batchesStocks: batches,
        });
      } else {
        // compute via aggregate for expired quantity
        const aggregate = await this.prisma.batcheStock.aggregate({
          where: {
            medicineStockId: ms.id,
            currentQuantity: { gt: 0 },
            batch: { expirationDate: { lte: new Date() } },
          },
          _sum: { currentQuantity: true },
        });
        expiredSum = aggregate._sum.currentQuantity ?? 0;
        medicineEntry.medicineStocks.push({
          medicineStockId: ms.id,
          medicineVariantId: ms.medicineVariant.id,
          pharmaceuticalForm: ms.medicineVariant.pharmaceuticalForm.name,
          unitMeasure: ms.medicineVariant.unitMeasure.acronym,
          dosage: ms.medicineVariant.dosage,
          complement: ms.medicineVariant.complement ?? undefined,
          minimumLevel: ms.minimumLevel,
          quantity: {
            current: ms.currentQuantity,
            available: ms.currentQuantity - expiredSum,
            unavailable: expiredSum,
          },
        });
      }
    }

    const stocks = Array.from(resultMap.values()).map((s) => ({
      stockId: s.stockId,
      stock: s.stock,
      medicines: Array.from(s.medicines.values()),
    }));

    return {
      stocks,
      meta: {
        page: 1,
        totalCount: inventory.length,
      },
    };
  }

  async getInventoryMetrics(institutionId: string): Promise<{
    quantity: {
      totalCurrent: number;
      available: number;
      unavailable: number;
      zero: number;
      expired: number;
    };
  }> {
    const [totalCurrent, available, zero] = await this.prisma.$transaction([
      this.prisma.medicineStock.aggregate({
        where: {
          stock: {
            institution: {
              id: institutionId,
            },
          },
          currentQuantity: { gt: 0 },
        },
        _sum: {
          currentQuantity: true,
        },
      }),
      this.prisma.batcheStock.aggregate({
        where: {
          stock: {
            institution: {
              id: institutionId,
            },
          },
          batch: {
            expirationDate: {
              gt: new Date(),
            },
          },
          currentQuantity: { gt: 0 },
        },
        _sum: {
          currentQuantity: true,
        },
      }),
      this.prisma.medicineStock.count({
        where: {
          stock: {
            institution: {
              id: institutionId,
            },
          },
          currentQuantity: 0,
        },
      }),
      this.prisma.batcheStock.aggregate({
        where: {
          stock: {
            institution: {
              id: institutionId,
            },
          },
          batch: {
            expirationDate: {
              gt: new Date(),
            },
          },
          currentQuantity: { gt: 0 },
        },
        _sum: {
          currentQuantity: true,
        },
      }),
    ]);

    return {
      quantity: {
        totalCurrent: totalCurrent._sum.currentQuantity ?? 0,
        available: available._sum.currentQuantity ?? 0,
        unavailable:
          (totalCurrent._sum.currentQuantity ?? 0) -
          (available._sum.currentQuantity ?? 0),
        zero,
        expired:
          (totalCurrent._sum.currentQuantity ?? 0) -
          (available._sum.currentQuantity ?? 0),
      },
    };
  }

  async fetchAll(): Promise<{ medicinesStock: MedicineStock[] }> {
    const medicinesStock = await this.prisma.medicineStock.findMany({
      include: {
        batchesStocks: {
          select: {
            id: true,
          },
        },
      },
    });

    const medicinesStockMapped = medicinesStock.map((item) => {
      return PrismaMedicineStockMapper.toDomain({
        ...item,
        batchesStocks: item.batchesStocks,
      });
    });

    return {
      medicinesStock: medicinesStockMapped,
    };
  }

  async stockIsZero(stockId: string): Promise<boolean> {
    const medicinesStockWithQuantityGreaterThanZero =
      await this.prisma.medicineStock.count({
        where: {
          stockId,
          currentQuantity: {
            gt: 0,
          },
        },
      });

    return medicinesStockWithQuantityGreaterThanZero === 0;
  }
}
