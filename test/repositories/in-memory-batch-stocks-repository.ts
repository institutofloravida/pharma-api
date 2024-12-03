import { BatchestocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { Batchestock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class InMemoryBatchestocksRepository implements BatchestocksRepository {
  public items: Batchestock[] = []

  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async create(batchestock: Batchestock) {
    this.items.push(batchestock)
    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchestock.medicineVariantId.toString(),
        batchestock.stockId.toString(),
      )

    if (!medicineStock) {
      return null
    }

    medicineStock.replenish(batchestock.quantity)
    await this.medicineStockRepository.save(medicineStock)
  }

  async replenish(batchestockId: string, quantity: number) {
    const batchestock = await this.findById(batchestockId)
    if (!batchestock) {
      return null
    }
    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchestock.medicineVariantId.toString(),
        batchestock.stockId.toString(),
      )
    if (!medicineStock) {
      return null
    }

    batchestock.replenish(quantity)
    medicineStock.replenish(quantity)

    await Promise.all([
      this.save(batchestock),
      this.medicineStockRepository.save(medicineStock),
    ])

    return batchestock
  }

  async subtract(batchestockId: string, quantity: number) {
    const batchestock = await this.findById(batchestockId)
    if (!batchestock) {
      return null
    }

    batchestock.subtract(quantity)
    await this.save(batchestock)

    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchestock.medicineVariantId.toString(),
        batchestock.stockId.toString(),
      )
    if (!medicineStock) {
      throw new Error('Medicine stock not found')
    }

    medicineStock.subtract(quantity)
    await this.medicineStockRepository.save(medicineStock)

    return batchestock
  }

  async findById(id: string): Promise<Batchestock | null> {
    const batchestock = this.items.find((item) => item.id.toString() === id)
    if (!batchestock) {
      return null
    }

    return batchestock
  }

  async findByBatchIdAndStockId(batchId: string, stockId: string) {
    const batchestock = this.items.find(
      (item) =>
        item.batchId.toString() === batchId &&
        item.stockId.toString() === stockId,
    )
    if (!batchestock) {
      return null
    }

    return batchestock
  }

  async save(batchestock: Batchestock) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === batchestock.id.toString(),
    )

    if (index === -1) {
      return null
    }

    this.items[index] = batchestock
  }
}
