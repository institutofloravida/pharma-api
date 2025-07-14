import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'
import { PrismaUseMedicineMapper } from '../mappers/prisma-use-medicine-maper'

@Injectable()
export class PrismaUseMedicinesRepository implements UseMedicinesRepository {
  constructor(private prisma: PrismaService) {}
  async create(useMedicine: UseMedicine): Promise<void> {
    const data = PrismaUseMedicineMapper.toPrisma(useMedicine)
    await this.prisma.useMedicine.create({
      data,
    })
  }

  async save(useMedicine: UseMedicine): Promise<void> {
    const data = PrismaUseMedicineMapper.toPrisma(useMedicine)

    await this.prisma.useMedicine.update({
      where: {
        year_month: {
          year: useMedicine.year,
          month: useMedicine.month,
        },
      },
      data,
    })
  }

  async findByYearAndMonth(year: number, month: number): Promise<UseMedicine | null> {
    const useMedicine = await this.prisma.useMedicine.findUnique({
      where: {
        year_month: {
          year, month,
        },
      },
    })

    if (!useMedicine) {
      return null
    }

    return PrismaUseMedicineMapper.toDomain(useMedicine)
  }
}
