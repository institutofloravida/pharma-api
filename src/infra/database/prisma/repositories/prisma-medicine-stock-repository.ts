import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { PrismaMedicineStockMapper } from '../mappers/prisma-medicine-stock-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details'
import { Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory'

@Injectable()
export class PrismaMedicinesStockRepository
implements MedicinesStockRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineStock: MedicineStock): Promise<void> {
    await this.prisma.medicineStock.create({
      data: PrismaMedicineStockMapper.toPrisma(medicineStock),
    })
  }

  async save(medicinestock: MedicineStock): Promise<void | null> {
    const medicineStock = await this.prisma.medicineStock.update({
      where: {
        id: medicinestock.id.toString(),
      },
      data: PrismaMedicineStockMapper.toPrisma(medicinestock),
    })

    if (!medicineStock) {
      return null
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
    })
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
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
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
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
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
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
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
    })

    if (!medicineStock) {
      return null
    }

    return PrismaMedicineStockMapper.toDomain(medicineStock)
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicinesStock = await this.prisma.medicineStock.findMany({
      where: {
        medicineVariantId: medicineStock.medicineVariantId.toString(),
        stockId: medicineStock.stockId.toString(),
      },
    })

    if (medicinesStock.length > 1) {
      return null
    }

    return medicineStock
  }

  async findMany(
    { page }: PaginationParams,
    filters: { stockId: string; medicineName?: string },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }> {
    const { stockId, medicineName } = filters

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
    }

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
    ])

    const medicinesStockMapped = medicinesStock.map((medicineStock) => {
      return MedicineStockDetails.create({
        id: new UniqueEntityId(medicineStock.id),
        dosage: medicineStock.medicineVariant.dosage,
        medicine: medicineStock.medicineVariant.medicine.name,
        pharmaceuticalForm:
          medicineStock.medicineVariant.pharmaceuticalForm.name,
        stock: medicineStock.stock.name,
        unitMeasure: medicineStock.medicineVariant.unitMeasure.acronym,
        currentQuantity: medicineStock.currentQuantity,
        medicineVariantId: new UniqueEntityId(medicineStock.medicineVariantId),
        stockId: new UniqueEntityId(medicineStock.stockId),
        createdAt: medicineStock.createdAt,
        updatedAt: medicineStock.updatedAt,
      })
    })

    return {
      medicinesStock: medicinesStockMapped,
      meta: {
        page,
        totalCount,
      },
    }
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
    const { isLowStock, medicineName, stockId, therapeuticClasses } = filters
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
      ...(medicineName && {
        medicineVariant: {
          medicine: {
            name: {
              contains: medicineName,
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
      }),
    }

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
            },
          },
          batchesStocks: {
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.medicineStock.count({
        where: whereClause,
      }),
    ])

    const inventoryMaped = inventory.map((medicineStock) => {
      return MedicineStockInventory.create({
        stockId: new UniqueEntityId(medicineStock.id),
        minimumLevel: medicineStock.minimumLevel,
        dosage: medicineStock.medicineVariant.dosage,
        unitMeasure: medicineStock.medicineVariant.unitMeasure.acronym,
        pharmaceuticalForm: medicineStock.medicineVariant.pharmaceuticalForm.name,
        currentQuantity: medicineStock.currentQuantity,
        medicineStockId: new UniqueEntityId(medicineStock.id),
        medicineVariantId: new UniqueEntityId(medicineStock.medicineVariant.id),
        batchesStockIds: medicineStock.batchesStocks.map(item => new UniqueEntityId(item.id)),
      })
    })

    return {
      inventory: inventoryMaped,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
