import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { Medicine as PrismaMedicine, type Prisma } from '@prisma/client'

export class PrismaMedicineMapper {
  static toDomain(raw: PrismaMedicine): Medicine {
    return Medicine.create({
      content: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      therapeuticClassesIds: [],
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicine: Medicine): Prisma.MedicineUncheckedCreateInput {
    return {
      id: medicine.id.toString(),
      name: medicine.content,
      description: medicine.description,
      therapeuticClasses: {
        connect: medicine.therapeuticClassesIds.map(item => ({ id: item.toString() })),
      },
      medicineVariants: {
        connect: medicine.medicinesVariantsIds.map(item => ({ id: item.toString() })),
      },
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    }
  }
}
