import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryOperatorsRepository } from './in-memory-operators-repository'
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details'
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository'

export class InMemoryMedicinesExitsRepository
implements MedicinesExitsRepository {
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
  ) {}

  public items: MedicineExit[] = []
  async create(medicineExit: MedicineExit) {
    this.items.push(medicineExit)
  }

  async findById(id: string): Promise<ExitDetails | null> {
    const medicineExit = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    )

    if (!medicineExit) {
      return null
    }

    const operator = this.operatorsRepository.items.find((item) =>
      item.id.equal(medicineExit.operatorId),
    )

    if (!operator) {
      throw new Error(
        `operator with id "${medicineExit.operatorId.toString()} does not exist."`,
      )
    }

    const stock = this.stocksRepository.items.find((stock) =>
      stock.id.equal(medicineExit.stockId),
    )
    if (!stock) {
      throw new Error(
        `stock with id "${medicineExit.stockId.toString()} does not exist."`,
      )
    }

    const items = this.movimentationRepository.items.filter(movimentation => {
      return movimentation.exitId
        ? movimentation.exitId?.equal(medicineExit.id)
        : false
    })

    return ExitDetails.create({
      exitDate: medicineExit.exitDate,
      stock: stock.content,
      exitType: medicineExit.exitType,
      operator: operator.name,
      exitId: medicineExit.id,
      items: items.length,
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      institutionId?: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }> {
    const {
      institutionId,
      exitDate,
      exitType,
      operatorId,
    } = filters
    const medicinesExitsFilteredAndMapped: ExitDetails[] = []

    for (const exit of this.items) {
      const operator = this.operatorsRepository.items.find((item) =>
        item.id.equal(exit.operatorId),
      )

      if (!operator) {
        throw new Error(
          `operator with id "${exit.operatorId.toString()} does not exist."`,
        )
      }

      const stock = this.stocksRepository.items.find((stock) =>
        stock.id.equal(exit.stockId),
      )
      if (!stock) {
        throw new Error(
          `stock with id "${exit.stockId.toString()} does not exist."`,
        )
      }

      if (
        institutionId &&
        !stock.institutionId.equal(new UniqueEntityId(institutionId))
      ) {
        continue
      }

      if (
        exitDate &&
        !(
          exit.exitDate.getDate() === exitDate.getDate() &&
          exit.exitDate.getMonth() === exitDate.getMonth() &&
          exit.exitDate.getFullYear() === exitDate.getFullYear()
        )
      ) {
        continue
      }

      if (exitType && exitType !== exit.exitType) {
        continue
      }

      if (
        operatorId &&
        !exit.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        continue
      }

      const items = this.movimentationRepository.items.filter(movimentation => {
        return movimentation.exitId
          ? movimentation.exitId?.equal(exit.id)
          : false
      })

      const medicineExitDetails = ExitDetails.create({
        exitDate: exit.exitDate,
        stock: stock.content,
        operator: operator.name,
        exitId: exit.id,
        exitType: exit.exitType,
        items: items.length,
      })

      medicinesExitsFilteredAndMapped.push(medicineExitDetails)
    }

    const medicinesPaginated = medicinesExitsFilteredAndMapped.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      medicinesExits: medicinesPaginated,
      meta: {
        page,
        totalCount: medicinesExitsFilteredAndMapped.length,
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
  //   exitType?: ExitType;
  // }): Promise<{ exitsMovimentation: Movimentation[]; meta: MetaReport }> {
  //   const {
  //     institutionId,
  //     startDate,
  //     endDate,
  //     batcheStockId,
  //     exitType,
  //     medicineId,
  //     medicineStockId,
  //     medicineVariantId,
  //     movementTypeId,
  //     operatorId,
  //     quantity,
  //     stockId,

  //   } = filters

  //   const exitsMovimentationFilteredAndMapped: Movimentation[] = []

  //   for (const exit of this.items) {
  //     const medicineStock = this.medicinesStockRepository.items.find((item) =>
  //       item.id.equal(exit.medicineStockId),
  //     )

  //     if (!medicineStock) {
  //       throw new Error(
  //         `Medicine Stock with id "${exit.medicineStockId.toString()} does not exist."`,
  //       )
  //     }

  //     const medicineVariant = this.medicinesVariantsRepository.items.find(
  //       (item) => item.id.equal(medicineStock.medicineVariantId),
  //     )

  //     if (!medicineVariant) {
  //       throw new Error(
  //         `Medicine variant with id "${medicineStock.medicineVariantId.toString()} does not exist."`,
  //       )
  //     }

  //     const medicine = this.medicinesRepository.items.find((item) =>
  //       item.id.equal(medicineVariant.medicineId),
  //     )

  //     if (!medicine) {
  //       throw new Error(
  //         `Medicine with id "${medicineVariant.medicineId.toString()} does not exist."`,
  //       )
  //     }

  //     const pharmaceuticalForm = this.pharmaceuticalFormsRepository.items.find(
  //       (item) => item.id.equal(medicineVariant.pharmaceuticalFormId),
  //     )

  //     if (!pharmaceuticalForm) {
  //       throw new Error(
  //         `Pharmaceutical Form with id "${medicineVariant.pharmaceuticalFormId.toString()} does not exist."`,
  //       )
  //     }

  //     const unitMeasure = this.unitsMeasureRepository.items.find((item) =>
  //       item.id.equal(medicineVariant.unitMeasureId),
  //     )

  //     if (!unitMeasure) {
  //       throw new Error(
  //         `Unit Measure with id "${medicineVariant.unitMeasureId.toString()} does not exist."`,
  //       )
  //     }

  //     const movementType = this.movementType.items.find((item) =>
  //       item.id.equal(exit.movementTypeId ?? new UniqueEntityId('')),
  //     )

  //     const batchStock = this.batchStocksRepository.items.find((item) =>
  //       item.id.equal(exit.batchestockId),
  //     )
  //     if (!batchStock) {
  //       throw new Error(
  //         `Batchstock with id "${exit.batchestockId.toString()} does not exist."`,
  //       )
  //     }

  //     const operator = this.operatorsRepository.items.find((item) =>
  //       item.id.equal(exit.operatorId),
  //     )

  //     if (!operator) {
  //       throw new Error(
  //         `operator with id "${exit.operatorId.toString()} does not exist."`,
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

  //     const stock = this.stocksRepository.items.find((stock) =>
  //       stock.id.equal(batchStock.stockId),
  //     )
  //     if (!stock) {
  //       throw new Error(
  //         `stock with id "${batchStock.stockId.toString()} does not exist."`,
  //       )
  //     }

  //     if (
  //       startDate &&
  //         exit.exitDate <
  //           new Date(startDate.setHours(0, 0, 0, 0))
  //     ) {
  //       continue
  //     }
  //     if (
  //       endDate &&
  //         exit.exitDate >
  //           new Date(endDate.setHours(23, 59, 59, 999))
  //     ) {
  //       continue
  //     }

  //     if (
  //       institutionId &&
  //       !stock.institutionId.equal(new UniqueEntityId(institutionId))
  //     ) {
  //       continue
  //     }

  //     if (exitType && exitType !== exit.exitType) {
  //       continue
  //     }

  //     if (
  //       medicineId &&
  //       !medicine.id.equal(new UniqueEntityId(medicineId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       medicineVariantId &&
  //       !medicineVariant.id.equal(new UniqueEntityId(medicineVariantId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       stockId &&
  //       !stock.id.equal(new UniqueEntityId(stockId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       medicineStockId &&
  //       !medicineStock.id.equal(new UniqueEntityId(medicineStockId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       batcheStockId &&
  //       !batchStock.id.equal(new UniqueEntityId(batcheStockId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       movementTypeId &&
  //       !exit.movementTypeId?.equal(new UniqueEntityId(movementTypeId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       operatorId &&
  //       !exit.operatorId.equal(new UniqueEntityId(operatorId))
  //     ) {
  //       continue
  //     }

  //     if (
  //       quantity &&
  //       exit.quantity !== quantity) {
  //       continue
  //     }

  //     const medicineExitDetails = Movimentation.create({
  //       direction: 'EXIT',
  //       batchStockId: batchStock.id,
  //       dosage: medicineVariant.dosage,
  //       medicine: medicine.content,
  //       pharmaceuticalForm: pharmaceuticalForm.content,
  //       unitMeasure: unitMeasure.acronym,
  //       medicineStockId: medicineStock.id,
  //       exitType: exit.exitType,
  //       movementDate: exit.exitDate,
  //       movementType: movementType
  //         ? movementType.content
  //         : ExitType.DISPENSATION,
  //       quantity: exit.quantity,
  //       stock: stock.content,
  //       operator: operator.name,
  //       batchCode: batch.code,
  //       medicineId: medicine.id,
  //       medicineVariantId: medicineVariant.id,
  //       movementTypeId: movementType
  //         ? movementType.id
  //         : undefined,
  //       operatorId: operator.id,
  //       pharmaceuticalFormId: pharmaceuticalForm.id,
  //       stockId: stock.id,
  //       unitMeasureId: unitMeasure.id,
  //       complement: medicineVariant.complement,

  //     })

  //     exitsMovimentationFilteredAndMapped.push(medicineExitDetails)
  //   }

  //   return {
  //     exitsMovimentation: exitsMovimentationFilteredAndMapped,
  //     meta: {
  //       totalCount: exitsMovimentationFilteredAndMapped.length,
  //     },
  //   }
  // }
}
