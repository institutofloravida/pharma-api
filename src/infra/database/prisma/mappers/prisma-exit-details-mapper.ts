import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details'
import { Exit as PrismaExit } from 'prisma/generated'

export class PrismaExitDetailsMapper {
  static toDomain(raw: PrismaExit & { operator: string, stock: string, items: number }): ExitDetails {
    return ExitDetails.create({
      exitId: new UniqueEntityId(raw.id),
      exitDate: raw.exitDate,
      operator: raw.operator,
      stock: raw.stock,
      exitType: ExitType[raw.exitType],
      items: Number(raw.items),
    })
  }
}
