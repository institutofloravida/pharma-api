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
    filters: { stockId: string; medicineName?: string },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }> {
    const { stockId, medicineName } = filters;

    const whereClause: Prisma.MedicineStockWhereInput = {
      stockId,
      medicineVariant: {
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
    { page }: PaginationParams,
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isCloseToExpiring?: boolean;
      isLowStock?: boolean;
    },
  ): Promise<{ inventory: MedicineStockInventory[]; meta: Meta }> {
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
        skip: (page - 1) * 10,
        take: 10,
        include: {
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
          stockId: new UniqueEntityId(medicineStock.id),
          minimumLevel: medicineStock.minimumLevel,
          dosage: medicineStock.medicineVariant.dosage,
          unitMeasure: medicineStock.medicineVariant.unitMeasure.acronym,
          medicine: medicineStock.medicineVariant.medicine.name,
          pharmaceuticalForm:
            medicineStock.medicineVariant.pharmaceuticalForm.name,
          quantity: {
            current: medicineStock.currentQuantity,
            available: medicineStock.currentQuantity,
            unavailable:
              medicineStock.currentQuantity -
              (totalQuantityBatchesOnStockExpired._sum.currentQuantity ?? 0),
          },
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
      unitMeasure: inventory.medicineVariant.unitMeasure.acronym,
      pharmaceuticalForm: inventory.medicineVariant.pharmaceuticalForm.name,
      minimumLevel: inventory.minimumLevel,
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
}
