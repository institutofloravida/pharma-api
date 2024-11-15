import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesRepository } from '@/domain/pharma/application/repositories/medicines-repository'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { PrismaMedicineMapper } from '../mappers/prisma-medicine-repository'

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
}