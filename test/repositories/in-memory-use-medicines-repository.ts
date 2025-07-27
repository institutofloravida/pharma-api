import { MetaReport } from '@/core/repositories/meta'
import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/entities/use-medicine'
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository'
import { UseMedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/use-medicine-details'
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository'
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository'
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository'
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository'

export class InMemoryUseMedicinesRepository implements UseMedicinesRepository {
  public items: UseMedicine[] = []

  constructor(
    private medicinesStockRepository: InMemoryMedicinesStockRepository,
    private stocksRepository: InMemoryStocksRepository,
    private institutionsRepository: InMemoryInstitutionsRepository,
    private medicinesExitsRepository: InMemoryMedicinesExitsRepository,
    private medicinesVariantsRepository: InMemoryMedicinesVariantsRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
    private batchStockRepository: InMemoryBatchStocksRepository,
  ) {}

  async create(useMedicine: UseMedicine): Promise<void> {
    this.items.push(useMedicine)
  }

  async save(useMedicine: UseMedicine): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equal(useMedicine.id),
    )
    this.items[itemIndex] = useMedicine
  }

  async findByMedicineStockIdAndYearAndMonth(
    year: number,
    month: number,
    medicineStockId: string,
  ): Promise<UseMedicine | null> {
    const useMedicine = this.items.find(
      (useMedicine) =>
        useMedicine.year === year &&
        useMedicine.month === month &&
        useMedicine.medicineStockId.equal(new UniqueEntityId(medicineStockId)),
    )
    if (!useMedicine) {
      return null
    }

    return useMedicine
  }

  async fetchMonthlyMedicinesUtilization(filters: {
    institutionId: string;
    year: number;
    month: number;
    stockId?: string;
  }): Promise<{
    utilization: UseMedicineDetails[];
    totalUtilization: number;
    meta: MetaReport;
  }> {
    const { institutionId, month, year, stockId } = filters

    const useMedicinesFiltered = this.items.filter((useMedicine) => {
      if (useMedicine.year !== year) return false
      if (useMedicine.month !== month) return false

      const medicineStock = this.medicinesStockRepository.items.find(
        (medicineStock) => medicineStock.id.equal(useMedicine.medicineStockId),
      )
      if (!medicineStock) {
        throw new Error(
          `Medicine Stock with id "${useMedicine.medicineStockId}" Not Found`,
        )
      }

      const stock = this.stocksRepository.items.find((stock) =>
        stock.id.equal(medicineStock.stockId),
      )

      if (!stock) {
        throw Error(`Stock with id "${medicineStock.stockId}" not found`)
      }

      if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) return false

      const institution = this.institutionsRepository.items.find(
        (institution) => institution.id.equal(stock.institutionId),
      )

      if (!institution) {
        throw Error(`Institution with id "${stock.institutionId}" not found`)
      }

      if (!institution.id.equal(new UniqueEntityId(institutionId))) { return false }
      useMedicine.currentBalance = medicineStock.quantity

      return true
    })

    const useMedicinesWithUsedCalculated = useMedicinesFiltered.map(
      (useMedicine) => {
        const movimentations = this.movimentationRepository.items.filter(
          (movimentation) => {
            if (movimentation.direction !== 'EXIT') { return false }
            const batchStock = this.batchStockRepository.items.find(
              (batchStock) =>
                batchStock.id.equal(movimentation.batchestockId),
            )
            if (!batchStock) {
              throw new Error(
                `Batch Stock with id "${movimentation.batchestockId}" not found`,
              )
            }

            if (!batchStock.medicineStockId.equal(useMedicine.medicineStockId)) {
              return false
            }

            return true
          },
        )

        const sumTotalMedicineUtilization =
          movimentations.reduce((sum, movimentation) => {
            const exit = this.medicinesExitsRepository.items.find(
              (item) => item.id.equal(movimentation.exitId ?? new UniqueEntityId()),
            )
            if (!exit) {
              throw new Error(
                `Exit with id "${movimentation.exitId?.toString()}" not found`,
              )
            }

            if (
              exit.exitDate.getFullYear() !== year ||
              exit.exitDate.getMonth() !== month
            ) { return sum }

            const stock = this.stocksRepository.items.find((stock) =>
              stock.id.equal(exit.stockId),
            )
            if (!stock) {
              throw new Error(
                `Stock with id "${exit.stockId}" not found`,
              )
            }

            if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) { return sum }

            const institution = this.institutionsRepository.items.find(
              (institution) => institution.id.equal(stock.institutionId),
            )
            if (!institution) {
              throw new Error(
                `Institution with id "${stock.institutionId}" not found`,
              )
            }

            if (!institution.id.equal(new UniqueEntityId(institutionId))) { return sum }

            return sum + movimentation.quantity
          }, 0)

        const medicineStock = this.medicinesStockRepository.items.find(
          (medicineStock) => medicineStock.id.equal(useMedicine.medicineStockId),
        )
        if (!medicineStock) {
          throw new Error(
          `Medicine Stock with id "${useMedicine.medicineStockId}" Not Found`,
          )
        }

        const medicineVariant = this.medicinesVariantsRepository.items.find(
          (medicineVariant) => medicineVariant.id.equal(medicineStock.medicineVariantId),
        )
        if (!medicineVariant) {
          throw new Error(
          `Medicine variant with id "${medicineStock.medicineVariantId}" Not Found`,
          )
        }

        const medicine = this.medicinesRepository.items.find(
          (medicine) => medicine.id.equal(medicineVariant.medicineId),
        )
        if (!medicine) {
          throw new Error(
          `Medicine  with id "${medicineVariant.medicineId}" Not Found`,
          )
        }

        const pharmaceuticalForm = this.pharmaceuticalFormsRepository.items.find(
          (pharmaceuticalForm) => pharmaceuticalForm.id.equal(medicineVariant.pharmaceuticalFormId),
        )
        if (!pharmaceuticalForm) {
          throw new Error(
          `Pharmaceutical form with id "${medicineVariant.pharmaceuticalFormId}" Not Found`,
          )
        }

        const unitMeasure = this.unitsMeasureRepository.items.find(
          (unitMeasure) => unitMeasure.id.equal(medicineVariant.unitMeasureId),
        )
        if (!unitMeasure) {
          throw new Error(
          `Unit Measure form with id "${medicineVariant.unitMeasureId}" Not Found`,
          )
        }

        const useMedicineDetails = UseMedicineDetails.create({
          dosage: medicineVariant.dosage,
          medicine: medicine.content,
          pharmaceuticalForm: pharmaceuticalForm.content,
          unitMeasure: unitMeasure.content,
          complement: medicineVariant.complement ?? undefined,
          id: useMedicine.id,
          currentBalance: useMedicine.currentBalance,
          createdAt: useMedicine.createdAt,
          medicineStockId: useMedicine.medicineStockId,
          month: useMedicine.month,
          previousBalance: useMedicine.previousBalance,
          updatedAt: useMedicine.updatedAt,
          used: sumTotalMedicineUtilization,
          year: useMedicine.year,
        })
        return useMedicineDetails
      },
    )

    const sumTotalUtilization = useMedicinesWithUsedCalculated.reduce(
      (sum, useMedicine) => {
        return sum + useMedicine.used
      },
      0,
    )

    return {
      meta: {
        totalCount: useMedicinesWithUsedCalculated.length,
      },
      totalUtilization: sumTotalUtilization,
      utilization: useMedicinesWithUsedCalculated,
    }
  }
}
