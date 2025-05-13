import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

export interface MedicineStockInventoryProps {
  medicineVariantId: UniqueEntityId
  medicineStockId: UniqueEntityId
  stockId: UniqueEntityId
  quantity: {
    current: number
    available: number
    unavailable: number
  }
  medicine: string
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

  get quantity() {
    return this.props.quantity
  }

  get medicine(): string {
    return this.props.medicine
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

  public isLowStock(minimunQuantity: number = this.props.minimumLevel): boolean {
    return this.props.quantity.available < minimunQuantity && this.props.quantity.available > 0
  }

  public isZero(): boolean {
    return this.props.quantity.current === 0
  }

  get batchesStockIds() {
    return this.props.batchesStockIds
  }

  static create(props: MedicineStockInventoryProps): MedicineStockInventory {
    return new MedicineStockInventory(props)
  }
}
