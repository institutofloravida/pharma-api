import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { MedicineVariant as PrismaMedicineVariant, type Prisma } from 'prisma/generated'
export class PrismaMedicineVariantMapper {
  static toDomain(raw: PrismaMedicineVariant): MedicineVariant {
    return MedicineVariant.create({
      medicineId: new UniqueEntityId(raw.medicineId),
      dosage: raw.dosage,
      pharmaceuticalFormId: new UniqueEntityId(raw.pharmaceuticalFormId),
      unitMeasureId: new UniqueEntityId(raw.unitMeasureId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicinevariant: MedicineVariant): Prisma.MedicineVariantUncheckedCreateInput {
    return {
      id: medicinevariant.id.toString(),
      dosage: medicinevariant.dosage,
      medicineId: medicinevariant.medicineId.toString(),
      pharmaceuticalFormId: medicinevariant.pharmaceuticalFormId.toString(),
      unitMeasureId: medicinevariant.unitMeasureId.toString(),
      createdAt: medicinevariant.createdAt,
      updatedAt: medicinevariant.updatedAt,
    }
  }
}
