import  { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import  { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class InMemoryBatchStocksRepository implements BatchStocksRepository {
  public items: BatchStock[] = []

  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async create(batchstock: BatchStock) {
    this.items.push(batchstock)
    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchstock.medicineVariantId.toString(),
        batchstock.stockId.toString(),
      )

    if (!medicineStock) {
      return null
    }

    medicineStock.replenish(batchstock.quantity)
    await this.medicineStockRepository.save(medicineStock)
  }

  async replenish(batchstockId: string, quantity: number) {
    const batchstock = await this.findById(batchstockId)
    if (!batchstock) {
      return null
    }
    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchstock.medicineVariantId.toString(),
        batchstock.stockId.toString(),
      )
    if (!medicineStock) {
      return null
    }

    batchstock.replenish(quantity)
    medicineStock.replenish(quantity)

    await Promise.all([
      this.save(batchstock),
      this.medicineStockRepository.save(medicineStock),
    ])

    return batchstock
  }

  async subtract(batchstockId: string, quantity: number) {
    const batchstock = await this.findById(batchstockId)
    if (!batchstock) {
      return null
    }

    batchstock.subtract(quantity)
    await this.save(batchstock)

    const medicineStock =
      await this.medicineStockRepository.findByMedicineVariantIdAndStockId(
        batchstock.medicineVariantId.toString(),
        batchstock.stockId.toString(),
      )
    if (!medicineStock) {
      throw new Error('Medicine stock not found')
    }

    medicineStock.subtract(quantity)
    await this.medicineStockRepository.save(medicineStock)

    return batchstock
  }

  async findById(id: string): Promise<BatchStock | null> {
    const batchstock = this.items.find((item) => item.id.toString() === id)
    if (!batchstock) {
      return null
    }

    return batchstock
  }

  async findByBatchIdAndStockId(batchId: string, stockId: string) {
    const batchstock = this.items.find(
      (item) =>
        item.batchId.toString() === batchId &&
        item.stockId.toString() === stockId,
    )
    if (!batchstock) {
      return null
    }

    return batchstock
  }

  async save(batchstock: BatchStock) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === batchstock.id.toString(),
    )

    if (index === -1) {
      return null
    }

    this.items[index] = batchstock
  }
}
