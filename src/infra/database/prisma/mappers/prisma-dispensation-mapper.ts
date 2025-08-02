import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation';
import { MedicineExit } from '@/domain/pharma/enterprise/entities/exit';
import {
  Dispensation as PrismaDispensation,
  type Prisma,
} from 'prisma/generated';

export class PrismaDispensationMapper {
  static toDomain(
    raw: PrismaDispensation & { exitRecords: MedicineExit[] },
  ): Dispensation {
    return Dispensation.create(
      {
        operatorId: new UniqueEntityId(raw.operatorId),
        patientId: new UniqueEntityId(raw.patientId),
        dispensationDate: raw.dispensationDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    dispensation: Dispensation,
  ): Prisma.DispensationUncheckedCreateInput {
    return {
      id: dispensation.id.toString(),
      dispensationDate: dispensation.dispensationDate,
      patientId: dispensation.patientId.toString(),
      operatorId: dispensation.operatorId.toString(),
      createdAt: dispensation.createdAt,
      updatedAt: dispensation.updatedAt,
    };
  }
}
