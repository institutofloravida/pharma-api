import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-details'
import { Medicine as PrismaMedicine } from 'prisma/generated'

export class PrismaMedicineDetailsMapper {
  static toDomain(raw: PrismaMedicine & { therapeuticClasses?: { id: string, name: string }[] }): MedicineDetails {
    return MedicineDetails.create({
      id: new UniqueEntityId(raw.id),
      content: raw.name,
      description: raw.description ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      therapeuticClasses: raw.therapeuticClasses?.map(tc => {
        return {
          id: new UniqueEntityId(tc.id),
          name: tc.name,
        }
      }) ?? [],
    })
  }
}
