import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { InMemoryBatchesRepository } from './in-memory-batches-repository'
import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch'
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository'
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository'
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms'

export class InMemoryBatchStocksRepository implements BatchStocksRepository {
  constructor(
    private batchesRepository: InMemoryBatchesRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private medicinesStocksRepository: InMemoryMedicinesStockRepository,
    private medicinesVariantsRepository: InMemoryMedicinesVariantsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
  ) {}

  public items: BatchStock[] = []

  async create(batchstock: BatchStock) {
    this.items.push(batchstock)
  }

  async replenish(batchstockId: string, quantity: number) {
    const batchstock = await this.findById(batchstockId)
    if (!batchstock) {
      return null
    }

    batchstock.replenish(quantity)

    await this.save(batchstock)

    return batchstock
  }

  async subtract(batchstockId: string, quantity: number) {
    const batchstock = await this.findById(batchstockId)
    if (!batchstock) {
      return null
    }

    batchstock.subtract(quantity)
    await this.save(batchstock)
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

  async findMany(
    { page }: PaginationParams,
    filters: { stockId: string; medicineStockId: string; code?: string },
  ): Promise<{ batchesStock: BatchStockWithBatch[]; meta: Meta }> {
    const { medicineStockId, stockId, code } = filters

    const batchesStock = this.items
    const batchesStocksFiltered: BatchStockWithBatch[] = []

    const medicineStock =
      await this.medicinesStocksRepository.findById(medicineStockId)
    if (!medicineStock) {
      throw new Error(
        `O estoque de medicamento com id ${medicineStockId} não foi encontrado!`,
      )
    }

    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) throw new Error(`Estoque com Id ${stockId} não foi encontrado`)
    const medicine = await this.medicinesRepository.findByMedicineVariantId(
      medicineStock.medicineVariantId.toString(),
    )
    if (!medicine) {
      throw new Error()
    }

    const medicineVariant = await this.medicinesVariantsRepository.findById(
      medicineStock.medicineVariantId.toString(),
    )
    if (!medicineVariant) {
      throw new Error(
        `variant com id ${medicineStock.medicineVariantId} não foi encontrada`,
      )
    }

    const pharmaceuticalForm =
      await this.pharmaceuticalFormsRepository.findById(
        medicineVariant?.pharmaceuticalFormId.toString(),
      )
    if (!pharmaceuticalForm) {
      throw new Error(
        `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
      )
    }

    const unitMeasure = await this.unitsMeasureRepository.findById(
      medicineVariant?.unitMeasureId.toString(),
    )
    if (!unitMeasure) {
      throw new Error(
        `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
      )
    }

    for (const batchStock of batchesStock) {
      if (!batchStock.stockId.equal(new UniqueEntityId(stockId))) continue

      if (
        !batchStock.medicineStockId.equal(new UniqueEntityId(medicineStockId))
      ) { continue }

      const batch = await this.batchesRepository.findById(
        batchStock.batchId.toString(),
      )

      if (!batch) {
        throw new Error(
          `Lote com id ${batchStock.batchId.toString()} não encontrado!`,
        )
      }

      if (
        code &&
        !batch.code.toLowerCase().includes(code.toLowerCase().trim())
      ) {
        continue
      }

      const batchStockWithBatch = BatchStockWithBatch.create({
        stock: stock.content,
        stockId: stock.id,
        batch: batch.code,
        batchId: batch.id,
        medicine: medicine.content,
        currentQuantity: batchStock.quantity,
        medicineVariantId: medicineVariant.id,
        medicineStockId: medicineStock.id,
        dosage: medicineVariant.dosage,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
        createdAt: batchStock.createdAt,
        updatedAt: batchStock.updatedAt,
      })
      batchesStocksFiltered.push(batchStockWithBatch)
    }
    const batchesStockPaginated = batchesStocksFiltered.slice(
      (page -1) * 10,
      page * 10,
    )

    return {
      batchesStock: batchesStockPaginated,
      meta: {
        page,
        totalCount: batchesStocksFiltered.length,
      },
    }
  }
}
