import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms'
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository'
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from './in-memory-batches-repository'
import { InMemoryOperatorsRepository } from './in-memory-operators-repository'
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository'

export class InMemoryMedicinesEntriesRepository
implements MedicinesEntriesRepository {
  constructor(
    private batchStocksRepository: InMemoryBatchStocksRepository,
    private batchesRepository: InMemoryBatchesRepository,
    private operatorsRepository: InMemoryOperatorsRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private medicinesVariantsRepository: InMemoryMedicinesVariantsRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private stocksRepository: InMemoryStocksRepository,
    private medicinesStockRepository: InMemoryMedicinesStockRepository,
  ) {}

  public items: MedicineEntry[] = []

  async create(medicineEntry: MedicineEntry) {
    this.items.push(medicineEntry)
  }

  async findManyByInstitutionId(
    { page }: PaginationParams,
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    medicineId?: string,
    medicineVariantId?: string,
  ): Promise<{
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[];
    meta: Meta;
  }> {
    const medicinesEntries = this.items
    const filteredByInstitution = medicinesEntries.filter((medicineEntry) => {
      const batchStock = this.batchStocksRepository.items.find((item) =>
        item.id.equal(medicineEntry.batcheStockId),
      )
      if (!batchStock) {
        throw new Error(
          `Batchstock with id "${medicineEntry.batcheStockId.toString()} does not exist."`,
        )
      }

      const batch = this.batchesRepository.items.find((batch) =>
        batch.id.equal(batchStock.batchId),
      )
      if (!batch) {
        throw new Error(
          `batch with id "${batchStock.batchId.toString} does not exist."`,
        )
      }
      const stock = this.stocksRepository.items.find((stock) => {
        return stock.id.equal(batchStock.stockId)
      })
      if (!stock) {
        throw new Error(
          `stock with id "${batchStock.stockId.toString()} does not exist."`,
        )
      }

      return stock.institutionId.equal(new UniqueEntityId(institutionId))
    })

    const medicinesEntriesMapped = filteredByInstitution.map(
      (medicineEntryMapped) => {
        const medicineStock = this.medicinesStockRepository.items.find(
          (medicineStock) => {
            return medicineStock.id.equal(medicineEntryMapped.medicineStockId)
          },
        )
        if (!medicineStock) {
          throw new Error(
            `medicine stock with id "${medicineEntryMapped.medicineStockId.toString()} does not exist."`,
          )
        }

        const medicineVariant = this.medicinesVariantsRepository.items.find(
          (medicineVariant) =>
            medicineVariant.id.equal(medicineStock.medicineVariantId),
        )

        if (!medicineVariant) {
          throw new Error(
            `Medicine variant with id "${medicineStock.medicineVariantId.toString()} does not exist."`,
          )
        }

        const medicine = this.medicinesRepository.items.find((medicine) =>
          medicine.id.equal(medicineVariant.medicineId),
        )

        if (!medicine) {
          throw new Error(
            `medicine with id "${medicineVariant.medicineId.toString()} does not exist."`,
          )
        }

        const pharmaceuticalForm =
          this.pharmaceuticalFormsRepository.items.find((pharmaceuticalForm) =>
            pharmaceuticalForm.id.equal(medicineVariant.pharmaceuticalFormId),
          )

        if (!pharmaceuticalForm) {
          throw new Error(
            `Pharmaceutical form with id "${medicineVariant.pharmaceuticalFormId} does not exist."`,
          )
        }

        const unitMeasure = this.unitsMeasureRepository.items.find(
          (unitMeasure) => unitMeasure.id.equal(medicineVariant.unitMeasureId),
        )

        if (!unitMeasure) {
          throw new Error(
            `Unit measure with id "${medicineVariant.unitMeasureId} does not exist."`,
          )
        }

        const batchStock = this.batchStocksRepository.items.find((item) =>
          item.id.equal(medicineEntryMapped.batcheStockId),
        )
        if (!batchStock) {
          throw new Error(
            `Batchstock with id "${medicineEntryMapped.batcheStockId.toString()} does not exist."`,
          )
        }

        const stock = this.stocksRepository.items.find((stock) =>
          stock.id.equal(batchStock.stockId),
        )

        if (!stock) {
          throw new Error(
            `stock with id "${batchStock.stockId.toString()} does not exist."`,
          )
        }

        const operator = this.operatorsRepository.items.find((operator) =>
          operator.id.equal(medicineEntryMapped.operatorId),
        )

        if (!operator) {
          throw new Error(
            `operator with id "${medicineEntryMapped.id.toString()} does not exist."`,
          )
        }

        const batch = this.batchesRepository.items.find((batch) =>
          batch.id.equal(batchStock.batchId),
        )

        if (!batch) {
          throw new Error(
            `batch with id "${batchStock.batchId.toString()} does not exist."`,
          )
        }

        return MedicineEntryWithMedicineVariantAndBatch.create({
          medicineId: medicine.id,
          medicine: medicine.content,
          medicineVariantId: medicineVariant.id,
          dosage: medicineVariant.dosage,
          pharmaceuticalFormId: pharmaceuticalForm.id,
          pharmaceuticalForm: pharmaceuticalForm.content,
          unitMeasureId: unitMeasure.id,
          unitMeasure: unitMeasure.acronym,
          stockId: stock.id,
          stock: stock.content,
          operatorId: operator.id,
          operator: operator.name,
          batchId: batch.id,
          batch: batch.code,
          quantityToEntry: medicineEntryMapped.quantity,
          createdAt: medicineEntryMapped.createdAt,
          updatedAt: medicineEntryMapped.updatedAt,
          medicineEntryId: medicineEntryMapped.id,
        })
      },
    )

    const medicinesEntriesByFilters = medicinesEntriesMapped.filter((item) => {
      if (
        operatorId &&
        !item.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        return null
      }
      if (stockId && !item.stockId.equal(new UniqueEntityId(stockId))) {
        return null
      }
      if (
        medicineId &&
        !item.medicineId.equal(new UniqueEntityId(medicineId))
      ) {
        return null
      }
      if (
        medicineVariantId &&
        !item.medicineVariantId.equal(new UniqueEntityId(medicineVariantId))
      ) {
        return null
      }

      return true
    })

    const medicinesEntriesFilteredAndPaginated =
      medicinesEntriesByFilters.slice((page -1) * 10, page * 10)

    return {
      medicinesEntries: medicinesEntriesFilteredAndPaginated,
      meta: {
        page,
        totalCount: medicinesEntriesByFilters.length,
      },
    }
  }
}
