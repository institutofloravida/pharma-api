import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryOperatorsRepository } from './in-memory-operators-repository'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository'

export class InMemoryMedicinesEntriesRepository
implements MedicinesEntriesRepository {
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
  ) {}

  public items: MedicineEntry[] = []

  async create(medicineEntry: MedicineEntry) {
    this.items.push(medicineEntry)
  }

  async findMany(
    { page, perPage = 10 }: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      stockId?: string;
      entryDate?: Date;
    },
  ): Promise<{ entries: EntryDetails[]; meta: Meta }> {
    const { institutionId, entryDate, operatorId, stockId } = filters
    const medicinesEntries = this.items

    const filteredByInstitution = medicinesEntries.filter((medicineEntry) => {
      const stock = this.stocksRepository.items.find((stock) => {
        return stock.id.equal(medicineEntry.stockId)
      })
      if (!stock) {
        throw new Error(
          `stock with id "${medicineEntry.stockId} does not exist."`,
        )
      }
      if (!stock.institutionId.equal(new UniqueEntityId(institutionId))) {
        return false
      }

      if (stockId && !medicineEntry.stockId.equal(new UniqueEntityId(stockId))) {
        return false
      }

      if (operatorId && !medicineEntry.operatorId.equal(new UniqueEntityId(operatorId))) {
        return false
      }
      if (entryDate && medicineEntry.entryDate.toISOString().split('T')[0] !== entryDate.toISOString().split('T')[0]) {
        return false
      }

      return true
    })

    const medicinesEntriesMapped = filteredByInstitution.map(
      (medicineEntryMapped) => {
        const stock = this.stocksRepository.items.find((stock) =>
          stock.id.equal(medicineEntryMapped.stockId),
        )

        if (!stock) {
          throw new Error(
            `stock with id "${medicineEntryMapped.stockId.toString()} does not exist."`,
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

        const items = this.movimentationRepository.items.filter((item) => {
          return item.entryId
            ? item.entryId.equal(medicineEntryMapped.id)
            : false
        })

        return EntryDetails.create({
          stock: stock.content,
          entryDate: medicineEntryMapped.entryDate,
          entryId: medicineEntryMapped.id,
          operator: operator.name,
          items: items.length,
          nfNumber: medicineEntryMapped.nfNumber,
        })
      },
    )

    const medicinesEntriesFilteredAndPaginated =
      medicinesEntriesMapped.slice((page - 1) * perPage, page * perPage)

    return {
      entries: medicinesEntriesFilteredAndPaginated,
      meta: {
        page,
        totalCount: medicinesEntriesMapped.length,
      },
    }
  }

  // async fetchMovimentation(filters: {
  //   institutionId: string;
  //   startDate: Date;
  //   endDate: Date;
  //   operatorId?: string;
  //   medicineId?: string;
  //   stockId?: string;
  //   medicineVariantId?: string;
  //   medicineStockId?: string;
  //   batcheStockId?: string;
  //   quantity?: number;
  //   movementTypeId?: string;
  // }): Promise<{ entriesMovimentation: Movimentation[]; meta: MetaReport }> {
  //   const {
  //     institutionId,
  //     startDate,
  //     endDate,
  //     batcheStockId,
  //     medicineId,
  //     quantity,
  //     stockId,
  //     medicineStockId,
  //     medicineVariantId,
  //     movementTypeId,
  //     operatorId,
  //   } = filters
  //   const medicinesEntries = this.items

  //   const filteredByInstitution = medicinesEntries.filter((medicineEntry) => {
  //     const batchStock = this.batchStocksRepository.items.find((item) =>
  //       item.id.equal(medicineEntry.batcheStockId),
  //     )
  //     if (!batchStock) {
  //       throw new Error(
  //         `Batchstock with id "${medicineEntry.batcheStockId.toString()} does not exist."`,
  //       )
  //     }

  //     const batch = this.batchesRepository.items.find((batch) =>
  //       batch.id.equal(batchStock.batchId),
  //     )
  //     if (!batch) {
  //       throw new Error(
  //         `batch with id "${batchStock.batchId.toString} does not exist."`,
  //       )
  //     }
  //     const stock = this.stocksRepository.items.find((stock) => {
  //       return stock.id.equal(batchStock.stockId)
  //     })
  //     if (!stock) {
  //       throw new Error(
  //         `stock with id "${batchStock.stockId.toString()} does not exist."`,
  //       )
  //     }

  //     return stock.institutionId.equal(new UniqueEntityId(institutionId))
  //   })

  //   const medicinesEntriesMapped = filteredByInstitution.map(
  //     (medicineEntryMapped) => {
  //       const medicineStock = this.medicinesStockRepository.items.find(
  //         (medicineStock) => {
  //           return medicineStock.id.equal(medicineEntryMapped.medicineStockId)
  //         },
  //       )
  //       if (!medicineStock) {
  //         throw new Error(
  //           `medicine stock with id "${medicineEntryMapped.medicineStockId.toString()} does not exist."`,
  //         )
  //       }

  //       const medicineVariant = this.medicinesVariantsRepository.items.find(
  //         (medicineVariant) =>
  //           medicineVariant.id.equal(medicineStock.medicineVariantId),
  //       )

  //       if (!medicineVariant) {
  //         throw new Error(
  //           `Medicine variant with id "${medicineStock.medicineVariantId.toString()} does not exist."`,
  //         )
  //       }

  //       const medicine = this.medicinesRepository.items.find((medicine) =>
  //         medicine.id.equal(medicineVariant.medicineId),
  //       )

  //       if (!medicine) {
  //         throw new Error(
  //           `medicine with id "${medicineVariant.medicineId.toString()} does not exist."`,
  //         )
  //       }

  //       const pharmaceuticalForm =
  //         this.pharmaceuticalFormsRepository.items.find((pharmaceuticalForm) =>
  //           pharmaceuticalForm.id.equal(medicineVariant.pharmaceuticalFormId),
  //         )

  //       if (!pharmaceuticalForm) {
  //         throw new Error(
  //           `Pharmaceutical form with id "${medicineVariant.pharmaceuticalFormId} does not exist."`,
  //         )
  //       }

  //       const unitMeasure = this.unitsMeasureRepository.items.find(
  //         (unitMeasure) => unitMeasure.id.equal(medicineVariant.unitMeasureId),
  //       )

  //       if (!unitMeasure) {
  //         throw new Error(
  //           `Unit measure with id "${medicineVariant.unitMeasureId} does not exist."`,
  //         )
  //       }

  //       const batchStock = this.batchStocksRepository.items.find((item) =>
  //         item.id.equal(medicineEntryMapped.batcheStockId),
  //       )
  //       if (!batchStock) {
  //         throw new Error(
  //           `Batchstock with id "${medicineEntryMapped.batcheStockId.toString()} does not exist."`,
  //         )
  //       }

  //       const stock = this.stocksRepository.items.find((stock) =>
  //         stock.id.equal(batchStock.stockId),
  //       )

  //       if (!stock) {
  //         throw new Error(
  //           `stock with id "${batchStock.stockId.toString()} does not exist."`,
  //         )
  //       }

  //       const operator = this.operatorsRepository.items.find((operator) =>
  //         operator.id.equal(medicineEntryMapped.operatorId),
  //       )

  //       if (!operator) {
  //         throw new Error(
  //           `operator with id "${medicineEntryMapped.id.toString()} does not exist."`,
  //         )
  //       }

  //       const batch = this.batchesRepository.items.find((batch) =>
  //         batch.id.equal(batchStock.batchId),
  //       )

  //       if (!batch) {
  //         throw new Error(
  //           `batch with id "${batchStock.batchId.toString()} does not exist."`,
  //         )
  //       }

  //       const movementType = this.movementTypeRepository.items.find((movementType) =>
  //         movementType.id.equal(medicineEntryMapped.movementTypeId),
  //       )

  //       if (!movementType) {
  //         throw new Error(
  //           `movement type with id "${medicineEntryMapped.movementTypeId.toString()} does not exist."`,
  //         )
  //       }

  //       return Movimentation.create({
  //         direction: 'ENTRY',
  //         medicine: medicine.content,
  //         dosage: medicineVariant.dosage,
  //         pharmaceuticalForm: pharmaceuticalForm.content,
  //         unitMeasure: unitMeasure.acronym,
  //         stock: stock.content,
  //         operator: operator.name,
  //         batchCode: batch.code,
  //         quantity: medicineEntryMapped.quantity,
  //         movementDate: medicineEntryMapped.entryDate,
  //         complement: medicineVariant.complement,
  //         medicineVariantId: medicineVariant.id,
  //         movementType: movementType.content,
  //         batchStockId: medicineEntryMapped.batcheStockId,
  //         medicineId: medicine.id,
  //         operatorId: operator.id,
  //         medicineStockId: medicineStock.id,
  //         pharmaceuticalFormId: pharmaceuticalForm.id,
  //         stockId: stock.id,
  //         unitMeasureId: unitMeasure.id,
  //         movementTypeId: movementType.id,
  //         exitType: undefined,
  //       })
  //     },
  //   )

  //   const entriesMovimentationByFilters = medicinesEntriesMapped.filter((item) => {
  //     if (
  //       startDate &&
  //         item.movementDate <
  //           new Date(startDate.setHours(0, 0, 0, 0))
  //     ) {
  //       return false
  //     }
  //     if (
  //       endDate &&
  //         item.movementDate >
  //           new Date(endDate.setHours(23, 59, 59, 999))
  //     ) {
  //       return false
  //     }

  //     if (
  //       operatorId &&
  //       !item.operatorId.equal(new UniqueEntityId(operatorId))
  //     ) {
  //       return null
  //     }
  //     if (stockId && !item.stockId.equal(new UniqueEntityId(stockId))) {
  //       return null
  //     }
  //     if (
  //       medicineId &&
  //       !item.medicineId.equal(new UniqueEntityId(medicineId))
  //     ) {
  //       return null
  //     }
  //     if (
  //       medicineVariantId &&
  //       !item.medicineVariantId.equal(new UniqueEntityId(medicineVariantId))
  //     ) {
  //       return null
  //     }

  //     if (
  //       batcheStockId &&
  //       !item.batchStockId.equal(new UniqueEntityId(batcheStockId))
  //     ) {
  //       return null
  //     }

  //     if (
  //       medicineStockId &&
  //       !item.medicineStockId.equal(new UniqueEntityId(medicineStockId))
  //     ) {
  //       return null
  //     }

  //     if (
  //       movementTypeId &&
  //       !item.movementTypeId.equal(new UniqueEntityId(movementTypeId))
  //     ) {
  //       return null
  //     }

  //     if (quantity && (item.quantity !== quantity)) {
  //       return null
  //     }

  //     return true
  //   })

  //   return {
  //     entriesMovimentation: entriesMovimentationByFilters,
  //     meta: {
  //       totalCount: entriesMovimentationByFilters.length,
  //     },
  //   }
  // }
}
