import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesVariantsRepository } from '@/domain/pharma/application/repositories/medicine-variant-repository'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { PrismaMedicineVariantMapper } from '../mappers/prisma-medicine-variant-mapper'

@Injectable()
export class PrismaMedicinesVariantsRepository implements MedicinesVariantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineVariant: MedicineVariant): Promise<void> {
    const data = PrismaMedicineVariantMapper.toPrisma(medicineVariant)
    await this.prisma.medicineVariant.create({
      data,
    })
  }

  async medicineVariantExists(medicineVariant: MedicineVariant): Promise<MedicineVariant | null> {
    const medicineVariantRecord = await this.prisma.medicineVariant.findFirst({
      where: {
        dosage: medicineVariant.dosage.trim(),
        pharmaceuticalFormId: medicineVariant.pharmaceuticalFormId.toString(),
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
}
