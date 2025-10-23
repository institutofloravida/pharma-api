import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { ExitWithStock } from '@/domain/pharma/enterprise/entities/value-objects/exit-with-stock';
import { Exit as PrismaExit } from 'prisma/generated';

export class PrismaExitDetailsMapper {
  static toDomain(
    raw: PrismaExit & {
      operator: string;
      stock: string;
      items: number;
      responsibleByInstitution?: string;
      destinationInstitution?: string;
    },
  ): ExitWithStock {
    return ExitWithStock.create({
      exitId: new UniqueEntityId(raw.id),
      exitDate: raw.exitDate,
      stockId: new UniqueEntityId(raw.stockId),
      operator: raw.operator,
      destinationInstitution: raw.destinationInstitution ?? undefined,
      responsibleByInstitution: raw.responsibleByInstitution ?? undefined,
      stock: raw.stock,
      exitType: ExitType[raw.exitType],
      items: Number(raw.items),
    });
  }
}
