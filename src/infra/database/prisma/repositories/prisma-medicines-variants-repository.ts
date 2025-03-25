import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesVariantsRepository } from '@/domain/pharma/application/repositories/medicine-variant-repository'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { PrismaMedicineVariantMapper } from '../mappers/prisma-medicine-variant-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { PrismaMedicineVariantWithMedicineMapper } from '../mappers/prisma-medicine-variant-with-medicine-mapper'
import { Meta } from '@/core/repositories/meta'

@Injectable()
export class PrismaMedicinesVariantsRepository implements MedicinesVariantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineVariant: MedicineVariant): Promise<void> {
    const data = PrismaMedicineVariantMapper.toPrisma(medicineVariant)
    await this.prisma.medicineVariant.create({
      data,
    })
  }

  async save(medicineVariant: MedicineVariant): Promise<void> {
    const data = PrismaMedicineVariantMapper.toPrisma(medicineVariant)

    await this.prisma.medicineVariant.update({
      where: {
        id: medicineVariant.id.toString(),
      },
      data,
    })
  }

  async medicineVariantExists(medicineVariant: MedicineVariant): Promise<MedicineVariant | null> {
    const medicineVariantRecord = await this.prisma.medicineVariant.findFirst({
      where: {
        medicineId: medicineVariant.medicineId.toString(),
        dosage: medicineVariant.dosage.trim(),
        pharmaceuticalFormId: medicineVariant.pharmaceuticalFormId.toString(),
        unitMeasureId: medicineVariant.unitMeasureId.toString(),
      },
    })

    if (!medicineVariantRecord) {
      return null
    }

    return PrismaMedicineVariantMapper.toDomain(medicineVariantRecord)
  }

  async findById(id: string): Promise<MedicineVariant | null> {
    const medicineVariant = await this.prisma.medicineVariant.findFirst({
      where: {
        id,
      },
    })

    if (!medicineVariant) {
      return null
    }

    return PrismaMedicineVariantMapper.toDomain(medicineVariant)
  }

  async findByIdWithDetails(id: string): Promise<MedicineVariantWithMedicine | null> {
    const medicineVariant = await this.prisma.medicineVariant.findUnique({
      where: {
        id,
      },
      include: {
        medicine: true,
        pharmaceuticalForm: true,
        unitMeasure: true,
      },
    })

    if (!medicineVariant) {
      return null
    }

    return PrismaMedicineVariantWithMedicineMapper.toDomain(medicineVariant)
  }

  async findManyByMedicineIdWithMedicine(
    medicineId: string,
    { page }: PaginationParams,
    content?: string,
  ):Promise<{
    medicinesVariants: MedicineVariantWithMedicine[],
    meta: Meta
  }> {
    const pageSize = 10
    const medicineVariants = await this.prisma.medicineVariant.findMany({
      where: {
        medicineId,
        AND: {
          medicine: {
            name: {
              contains: content ?? '',
              mode: 'insensitive',

            },
          },
        },
      },
      include: {
        medicine: true,
        pharmaceuticalForm: true,
        unitMeasure: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const totalCount = await this.prisma.medicineVariant.count({
      where: {
        medicineId,
        AND: {
          medicine: {
            name: {
              contains: content ?? '',
              mode: 'insensitive',
            },
          },
        },
      },
    })

    const medicineVariantsMappered = medicineVariants.map(PrismaMedicineVariantWithMedicineMapper.toDomain)

    return {
      medicinesVariants: medicineVariantsMappered,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
