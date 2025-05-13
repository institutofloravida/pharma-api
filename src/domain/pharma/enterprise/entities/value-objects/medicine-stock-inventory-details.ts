import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface MedicineStockInventoryDetailsProps {
  medicineStockId: UniqueEntityId
  medicine: string
  stockId: UniqueEntityId
  pharmaceuticalForm: string
  unitMeasure: string
  dosage: string
  minimumLevel: number
  quantity: {
    totalCurrent: number,
    available: number,
    unavailable: number
  }
  batchesStock: {
    id: UniqueEntityId,
    code: string,
    quantity: number,
    expirationDate: Date
    manufacturingDate?: Date | null
    manufacturer: string
    isCloseToExpiration: boolean
    isExpired: boolean
  }[]
}

export class MedicineStockInventoryDetails extends ValueObject<MedicineStockInventoryDetailsProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get medicine() {
    return this.props.medicine
  }

  get stockId(): UniqueEntityId {
    return this.props.stockId
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

  get minimumLevel() {
    return this.props.minimumLevel
  }

  public isLowStock(minimunQuantity: number = this.props.minimumLevel): boolean {
    return this.totalQuantity() < minimunQuantity
  }

  get quantity() {
    return this.props.quantity
  }

  get batchesStock() {
    return this.props.batchesStock
  }

  public totalQuantity(): number {
    const total = this.props.batchesStock.reduce((acc, batch) => {
      return acc + Number(batch.quantity)
    }
    , 0)
    return total
  }

  static create(props: MedicineStockInventoryDetailsProps) {
    return new MedicineStockInventoryDetails(props)
  }
}
