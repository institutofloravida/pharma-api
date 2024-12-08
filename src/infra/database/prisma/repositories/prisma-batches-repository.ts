import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BatchesRepository } from '@/domain/pharma/application/repositories/batches-repository'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'
import { PrismaBatchMapper } from '../mappers/prisma-batch-mapper'

@Injectable()
export class PrismaBatchesRepository
implements BatchesRepository {
  constructor(private prisma: PrismaService) {}
  async create(batch: Batch): Promise<void> {
    await this.prisma.batch.create({
      data: PrismaBatchMapper.toPrisma(batch),
    })
  }

  async findById(id: string): Promise<Batch | null> {
    const batch = await this.prisma.batch.findUnique({
      where: {
        id,
      },
    })

    if (!batch) {
      return null
    }

    return PrismaBatchMapper.toDomain(batch)
  }
}
