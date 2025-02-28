import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { Medicine as PrismaMedicine, type Prisma } from '@prisma/client'
export class PrismaMedicineMapper {
  static toDomain(raw: PrismaMedicine & { therapeuticClasses?: { id: string }[]; medicineVariants?: { id: string }[] }): Medicine {
    return Medicine.create({
      content: raw.name,
      description: raw.description ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      therapeuticClassesIds: raw.therapeuticClasses?.map(tc => new UniqueEntityId(tc.id)) ?? [],
      medicinesVariantsIds: raw.medicineVariants?.map(mv => new UniqueEntityId(mv.id)) ?? [],
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicine: Medicine): Prisma.MedicineUncheckedCreateInput {
    return {
      id: medicine.id.toString(),
      name: medicine.content,
      description: medicine.description,
      medicineVariants: {
        connect: medicine.medicinesVariantsIds.map(item => ({ id: item.toString() })),
      },
      therapeuticClasses: {
        connect: medicine.therapeuticClassesIds.map(item => ({ id: item.toString() })),
      },
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    }
  }
}
