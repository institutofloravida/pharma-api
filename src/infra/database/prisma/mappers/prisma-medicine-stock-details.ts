import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details'
import {
  BatcheStock as PrismaMedicineStock,
  MedicineVariant as PrismaMedicineVariant,
  Medicine as PrismaMedicine,
  PharmaceuticalForm as PrismaPharmaceuticalForm,
  Stock as PrismaStock,
  UnitMeasure as PrismaUnitMeasure,
} from 'prisma/generated'

type PrismaMedicineStockDetails = PrismaMedicineStock & {
  medicineVariant: PrismaMedicineVariant,
  medicine: PrismaMedicine,
  pharmaceuticalForm: PrismaPharmaceuticalForm,
  stock: PrismaStock,
  unitMeasure: PrismaUnitMeasure

}

export class PrismaMedicineStockDetailsMapper {
  static toDomain(raw: PrismaMedicineStockDetails): MedicineStockDetails {
    return MedicineStockDetails.create(
      {
        id: new UniqueEntityId(raw.id),
        dosage: raw.medicineVariant.dosage,
        medicine: raw.medicine.name,
        pharmaceuticalForm: raw.pharmaceuticalForm.name,
        stock: raw.stock.name,
        unitMeasure: raw.unitMeasure.acronym,
        quantity: {
          totalCurrent: raw.currentQuantity,
          available: 0,
          unavailable: 0,
        },
        medicineVariantId: new UniqueEntityId(raw.medicineVariantId),
        stockId: new UniqueEntityId(raw.stockId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
    )
  }
}
