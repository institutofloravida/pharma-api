import { MetaReport } from '@/core/repositories/meta'
import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository'

export class InMemoryUseMedicinesRepository implements UseMedicinesRepository {
  public items: UseMedicine[] = []

  constructor(
    private medicinesStockRepository: InMemoryMedicinesStockRepository,
    private inMemoryStocksRepository: InMemoryStocksRepository,
    private InMemoryInstitutionsRepository: InMemoryInstitutionsRepository,
    private inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository,
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
    utilization: UseMedicine[];
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

      const stock = this.inMemoryStocksRepository.items.find((stock) =>
        stock.id.equal(medicineStock.stockId),
      )

      if (!stock) {
        throw Error(`Stock with id "${medicineStock.stockId}" not found`)
      }

      if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) return false

      const institution = this.InMemoryInstitutionsRepository.items.find(
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
        const sumTotalMedicineUtilization =
          this.inMemoryMedicinesExitsRepository.items.reduce((sum, exit) => {
            if (
              exit.exitDate.getFullYear() !== year ||
              exit.exitDate.getMonth() !== month
            ) { return sum }

            const medicineStock = this.medicinesStockRepository.items.find(
              (medicineStock) => medicineStock.id.equal(exit.medicineStockId),
            )
            if (!medicineStock) {
              throw new Error(
                `Medicine Stock with id "${exit.medicineStockId}" Not Found`,
              )
            }

            const stock = this.inMemoryStocksRepository.items.find((stock) =>
              stock.id.equal(medicineStock.stockId),
            )
            if (!stock) {
              throw new Error(
                `Stock with id "${medicineStock.stockId}" not found`,
              )
            }

            if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) { return sum }

            const institution = this.InMemoryInstitutionsRepository.items.find(
              (institution) => institution.id.equal(stock.institutionId),
            )
            if (!institution) {
              throw new Error(
                `Institution with id "${stock.institutionId}" not found`,
              )
            }

            if (!institution.id.equal(new UniqueEntityId(institutionId))) { return sum }

            return sum + exit.quantity
          }, 0)

        useMedicine.used = sumTotalMedicineUtilization
        return useMedicine
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
