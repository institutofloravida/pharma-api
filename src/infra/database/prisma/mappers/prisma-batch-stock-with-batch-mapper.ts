import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch'
import {
  BatcheStock as PrismaBatchStock,
  Batch as PrismaBatch,
  MedicineVariant as PrismaMedicineVariant,
  Medicine as PrismaMedicine,
  PharmaceuticalForm as PrismaPharmaceuticalForm,
  Stock as PrismaStock,
  UnitMeasure as PrismaUnitMeasure,
} from '@prisma/client'

type PrismaBatchStockWithBatch = PrismaBatchStock & {
  batch: PrismaBatch
  medicineVariant: PrismaMedicineVariant,
  medicine: PrismaMedicine,
  pharmaceuticalForm: PrismaPharmaceuticalForm,
  stock: PrismaStock,
  unitMeasure: PrismaUnitMeasure

}

export class PrismaBatchStockWithBatchMapper {
  static toDomain(raw: PrismaBatchStockWithBatch): BatchStockWithBatch {
    return BatchStockWithBatch.create(
      {
        id: new UniqueEntityId(raw.id),
        batchId: new UniqueEntityId(raw.batchId),
        batch: raw.batch.code,
        dosage: raw.medicineVariant.dosage,
        medicine: raw.medicine.name,
        pharmaceuticalForm: raw.pharmaceuticalForm.name,
        stock: raw.stock.name,
        unitMeasure: raw.unitMeasure.acronym,
        currentQuantity: raw.currentQuantity,
        medicineVariantId: new UniqueEntityId(raw.medicineVariantId),
        stockId: new UniqueEntityId(raw.stockId),
        expirationDate: new Date(),
        medicineStockId: new UniqueEntityId(raw.medicineStockId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
    )
  }
}
