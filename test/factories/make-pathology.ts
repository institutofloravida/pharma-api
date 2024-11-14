import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Pathology, type PathologyProps } from '@/domain/pharma/enterprise/entities/pathology'
import { PrismaPathologyMapper } from '@/infra/database/prisma/mappers/prisma-pathology-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makePathology(
  override: Partial<PathologyProps> = {},
  id?: UniqueEntityId,
) {
  const pathology = Pathology.create({
    content: faker.lorem.sentence(),
    ...override,
  },
  id)

  return pathology
}

@Injectable()
export class PathologyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPathology(data: Partial<PathologyProps> = {}): Promise<Pathology> {
    const pathology = makePathology({
      ...data,
    })

    await this.prisma.pathology.create({
      data: PrismaPathologyMapper.toPrisma(pathology),
    })

    return pathology
  }
}
