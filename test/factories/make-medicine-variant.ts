import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineVariant, type MedicineVariantProps } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { faker } from '@faker-js/faker'

export function makeMedicineVariant(
  override: Partial<MedicineVariantProps> = {},
  id?: UniqueEntityId,
) {
  const medicineVariant = MedicineVariant.create({
    dosage: `${faker.number.int({ min: 1, max: 500 })}mg`,
    pharmaceuticalFormId: new UniqueEntityId(),
    medicineId: new UniqueEntityId(),
    unitMeasureId: new UniqueEntityId(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return medicineVariant
}
