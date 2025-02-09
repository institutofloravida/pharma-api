import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesRepository } from '@/domain/pharma/application/repositories/medicines-repository'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { PrismaMedicineMapper } from '../mappers/prisma-medicine-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaMedicinesRepository implements MedicinesRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicine: Medicine): Promise<void> {
    const data = PrismaMedicineMapper.toPrisma(medicine)
    await this.prisma.medicine.create({
      data,
    })
  }

  async findByContent(content: string): Promise<Medicine | null> {
    const medicine = await this.prisma.medicine.findFirst({
      where: {
        name: {
          equals: content.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!medicine) {
      return null
    }

    return PrismaMedicineMapper.toDomain(medicine)
  }

  async addMedicinesVariantsId(
    medicineId: string,
    medicineVariantId: string,
  ): Promise<void> {
    await this.prisma.medicine.update({
      where: {
        id: medicineId,
      },
      data: {
        medicineVariants: {
          connect: {
            id: medicineVariantId,
          },
        },
      },
    })
  }

  async findByMedicineVariantId(medicineVariantid: string): Promise<Medicine | null> {
    const medicineVariant = await this.prisma.medicineVariant.findFirst({
      where: {
        id: medicineVariantid,
      },
      include: {
        medicine: true,
      },
    })
    if (!medicineVariant) return null

    return PrismaMedicineMapper.toDomain(medicineVariant.medicine)
  }

  async medicineExists(medicine: Medicine): Promise<Medicine | null> {
    const medicineRecord = await this.prisma.medicine.findFirst({
      where: {
        name: medicine.content,
      },
    })

    if (!medicineRecord) {
      return null
    }

    return PrismaMedicineMapper.toDomain(medicineRecord)
  }

  async findById(id: string): Promise<Medicine | null> {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id },
    })

    if (!medicine) {
      return null
    }

    return PrismaMedicineMapper.toDomain(medicine)
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ medicines: Medicine[]; meta: Meta }> {
    const medicines = await this.prisma.medicine.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page -1) * 10,
      take: 10,
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
    })

    const totalCount = await this.prisma.medicine.count({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
    })
    const medicinesMappered = medicines.map(PrismaMedicineMapper.toDomain)
    return {
      medicines: medicinesMappered,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
