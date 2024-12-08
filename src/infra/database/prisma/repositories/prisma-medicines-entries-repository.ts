import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { PrismaMedicineEntryMapper } from '../mappers/prisma-medicine-entry-mapper'

@Injectable()
export class PrismaMedicinesEntriesRepository implements MedicinesEntriesRepository {
  constructor(private prisma: PrismaService) {}
  async create(medicineEntry: MedicineEntry): Promise<void> {
    await this.prisma.medicineEntry.create({
      data: PrismaMedicineEntryMapper.toPrisma(medicineEntry),
    })
  }
}
