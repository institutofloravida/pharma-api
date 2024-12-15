import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { MedicineVariant as PrismaMedicineVariant, Medicine as PrismaMedicine, type PharmaceuticalForm as PrismaPharmaceuticalForm, UnitMeasure as PrismaUnitMeasure } from '@prisma/client'

type PrismaMedicineVariantWithMedicine = PrismaMedicineVariant & {
  medicine: PrismaMedicine
  pharmaceuticalForm: PrismaPharmaceuticalForm
  unitMeasure: PrismaUnitMeasure
}

export class PrismaMedicineVariantWithMedicineMapper {
  static toDomain(raw: PrismaMedicineVariantWithMedicine): MedicineVariantWithMedicine {
    return MedicineVariantWithMedicine.create({
      medicineVariantId: new UniqueEntityId(raw.id),
      medicine: raw.medicine.name,
      pharmaceuticalForm: raw.pharmaceuticalForm.name,
      unitMeasure: raw.unitMeasure.acronym,
      medicineId: new UniqueEntityId(raw.medicineId),
      dosage: raw.dosage,
      pharmaceuticalFormId: new UniqueEntityId(raw.pharmaceuticalFormId),
      unitMeasureId: new UniqueEntityId(raw.unitMeasureId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    },

    )
  }
}
