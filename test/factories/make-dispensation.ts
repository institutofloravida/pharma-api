import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Dispensation, type DispensationProps } from '@/domain/pharma/enterprise/entities/dispensation'
import { PrismaDispensationMapper } from '@/infra/database/prisma/mappers/prisma-dispensation-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeDispensation(
  override: Partial<DispensationProps> = {},
  id?: UniqueEntityId,
) {
  const dispensation = Dispensation.create({
    dispensationDate: new Date(),
    operatorId: new UniqueEntityId(),
    patientId: new UniqueEntityId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  },
  id,
  )

  return dispensation
}

@Injectable()
export class DispensationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDispensation(data: Partial<DispensationProps> = {}): Promise<Dispensation> {
    const dispensation = makeDispensation(data)

    await this.prisma.dispensation.create({
      data: PrismaDispensationMapper.toPrisma(dispensation),
    })

    return dispensation
  }
}
