import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import type { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class InMemoryBatchStocksRepository implements BatchStocksRepository {
  public items: BatchStock[] = []

  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async create(batchStock: BatchStock) {
    this.items.push(batchStock)
    const medicineStock = await this.medicineStockRepository.findByMedicineIdAndStockId(batchStock.medicineId.toString(), batchStock.stockId.toString())
    if (!medicineStock) {
      return null
    }
    medicineStock.replenish(batchStock.quantity)
    await this.medicineStockRepository.save(medicineStock)
  }

  async replenish(batchStockId: string, quantity: number) {
    const batchStock = await this.findById(batchStockId)
    if (!batchStock) {
      return null
    }
    const medicineStock = await this.medicineStockRepository.findByMedicineIdAndStockId(batchStock.medicineId.toString(), batchStock.stockId.toString())
    if (!medicineStock) {
      return null
    }
    batchStock.replenish(quantity)
    medicineStock.replenish(batchStock.quantity)

    await Promise.all([
      this.save(batchStock),
      this.medicineStockRepository.save(medicineStock),

    ])

    return batchStock
  }

  async subtract(batchStockId: string, quantity: number) {
    const batchStock = await this.findById(batchStockId)
    if (!batchStock) {
      return null
    }

    batchStock.subtract(quantity)
    await this.save(batchStock)

    const medicineStock = await this.medicineStockRepository.findByMedicineIdAndStockId(batchStock.medicineId.toString(), batchStock.stockId.toString())
    if (!medicineStock) {
      throw new Error('Medicine stock not found')
    }

    medicineStock.subtract(quantity)
    await this.medicineStockRepository.save(medicineStock)

    return batchStock
  }

  async findById(id: string): Promise<BatchStock | null> {
    const batchstock = this.items.find(item => item.id.toString() === id)
    if (!batchstock) {
      return null
    }

    return batchstock
  }

  async findByBatchIdAndStockId(batchId: string, stockId: string) {
    const batchStock = this.items.find(item => item.batchId.toString() === batchId && item.stockId.toString() === stockId)
    if (!batchStock) {
      return null
    }

    return batchStock
  }

  async save(batchStock: BatchStock) {
    const index = this.items.findIndex(item => item.id.toString() === batchStock.id.toString())

    if (index === -1) {
      return null
    }

    this.items[index] = batchStock
  }
}
