import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import { MedicineExit } from '@/domain/pharma/enterprise/entities/exit'
import { PrismaMedicineExitMapper } from '../mappers/prisma-medicine-exit-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaMedicinesExitsRepository implements MedicinesExitsRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(medicineExit: MedicineExit): Promise<void> {
    const data = PrismaMedicineExitMapper.toPrisma(medicineExit)
    await this.prisma.exit.create({
      data,
    })
  }
}
