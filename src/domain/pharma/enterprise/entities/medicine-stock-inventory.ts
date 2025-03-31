import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

export interface MedicineStockInventoryProps {
  medicineVariantId: UniqueEntityId
  medicineStockId: UniqueEntityId
  stockId: UniqueEntityId
  currentQuantity: number
  pharmaceuticalForm: string
  unitMeasure: string
  dosage: string
  minimumLevel: number
  batchesStockIds: UniqueEntityId[]
}

export class MedicineStockInventory extends ValueObject<MedicineStockInventoryProps> {
  get medicineVariantId(): UniqueEntityId {
    return this.props.medicineVariantId
  }

  get medicineStockId(): UniqueEntityId {
    return this.props.medicineStockId
  }

  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get quantity(): number {
    return this.props.currentQuantity
  }

  get pharmaceuticalForm(): string {
    return this.props.pharmaceuticalForm
  }

  get unitMeasure(): string {
    return this.props.unitMeasure
  }

  get dosage(): string {
    return this.props.dosage
  }

  public isLowStock(minimunQuantity: number): boolean {
    return this.props.currentQuantity < minimunQuantity
  }

  get batchesStockIds() {
    return this.props.batchesStockIds
  }

  static create(props: MedicineStockInventoryProps): MedicineStockInventory {
    return new MedicineStockInventory(props)
  }
}
