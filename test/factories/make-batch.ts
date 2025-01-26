import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Batch, type BatchProps } from '@/domain/pharma/enterprise/entities/batch'
import { PrismaBatchMapper } from '@/infra/database/prisma/mappers/prisma-batch-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeBatch(
  override: Partial<BatchProps> = {},
  id?: UniqueEntityId,
) {
  const batch = Batch.create({
    manufacturerId: new UniqueEntityId(),
    code: faker.string.alphanumeric({ length: 8 }),
    expirationDate: faker.date.future(),
    manufacturingDate: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return batch
}

@Injectable()
export class BatchFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBatch(data: Partial<BatchProps> = {}): Promise<Batch> {
    const batch = makeBatch(data)
    await this.prisma.batch.create({
      data: PrismaBatchMapper.toPrisma(batch),
    })

    return batch
  }
}
