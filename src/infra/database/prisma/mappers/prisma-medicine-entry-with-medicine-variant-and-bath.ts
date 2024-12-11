import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import {
  Batch as PrismaBatch,
  MedicineVariant as PrismaMedicineVariant,
  MedicineEntry as PrismaMedicineEntry,
  Medicine as PrismaMedicine,
  PharmaceuticalForm as PrismaPharmaceuticalForm,
  UnitMeasure as PrismaUnitMeasure,
  Operator as PrismaOperator,
  Stock as PrismaStock,
} from '@prisma/client'

type PrismaMedicineEntryWithMedicineVariantAndBatch = PrismaMedicineEntry & {
  medicine: PrismaMedicine,
  medicineVariant: PrismaMedicineVariant,
  pharmaceuticalForm: PrismaPharmaceuticalForm,
  unitMeasure: PrismaUnitMeasure
  batch: PrismaBatch
  operator: PrismaOperator
  stock: PrismaStock
}

export class PrismaMedicineEntryWithMedicineVariantAndBatchMapper {
  static toDomain(
    raw: PrismaMedicineEntryWithMedicineVariantAndBatch,
  ): MedicineEntryWithMedicineVariantAndBatch {
    return MedicineEntryWithMedicineVariantAndBatch.create({
      batch: raw.batch.code,
      batchId: new UniqueEntityId(raw.batch.id),
      medicineVariantId: new UniqueEntityId(raw.medicineVariant.id),
      operator: raw.operator.name,
      operatorId: new UniqueEntityId(raw.operator.id),
      quantityToEntry: raw.quantity,
      stock: raw.stock.name,
      stockId: new UniqueEntityId(raw.stock.id),
      medicine: raw.medicine.name,
      pharmaceuticalForm: raw.pharmaceuticalForm.name,
      medicineId: new UniqueEntityId(raw.medicine.id),
      dosage: raw.medicineVariant.dosage,
      pharmaceuticalFormId: new UniqueEntityId(raw.pharmaceuticalForm.id),
      unitMeasureId: new UniqueEntityId(raw.unitMeasure.id),
      unitMeasure: raw.unitMeasure.acronym,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    })
  }
}
