import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta, MetaReport } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import {
  Dispensation,
  type DispensationPerDay,
} from '@/domain/pharma/enterprise/entities/dispensation'
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository'
import { InMemoryOperatorsRepository } from './in-memory-operators-repository'
import { InMemoryPatientsRepository } from './in-memory-patients-repository'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { MostTreatedPathology } from '@/domain/pharma/enterprise/entities/pathology'
import { InMemoryPathologiesRepository } from './in-memory-pathologies-repository'

export class InMemoryDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  public items: Dispensation[] = []
  constructor(
    private exitsRepository: InMemoryMedicinesExitsRepository,
    private operatorsRepository: InMemoryOperatorsRepository,
    private patientsRepository: InMemoryPatientsRepository,
    private medicinesStocksRepository: InMemoryMedicinesStockRepository,
    private stocksRepository: InMemoryStocksRepository,
    private pathologiesRepository: InMemoryPathologiesRepository,

  ) {}

  async create(dispensation: Dispensation) {
    this.items.push(dispensation)
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      patientId?: string;
      dispensationDate?: Date;
    },
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: Meta }> {
    const { patientId, dispensationDate } = filters
    const dispensations = this.items

    const dispensationsFiltered = dispensations
      .filter((dispensation) => {
        if (
          patientId &&
          !dispensation.patientId.equal(new UniqueEntityId(patientId))
        ) {
          return false
        }

        if (
          dispensationDate &&
          dispensation.dispensationDate.setHours(0, 0, 0, 0) !==
            dispensationDate.setHours(0, 0, 0, 0)
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const dispensationsPaginated = dispensationsFiltered.slice(
      (page - 1) * 10,
      page * 10,
    )

    const dispensationsMapped = dispensationsPaginated.map((dispensation) => {
      const exitsOfDispensation = this.exitsRepository.items.filter((exit) =>
        exit.dispensationId?.equal(dispensation.id),
      )

      const operator = this.operatorsRepository.items.find((operator) =>
        operator.id.equal(dispensation.operatorId),
      )

      if (!operator) {
        throw new Error('Operador não encontrado.')
      }

      const patient = this.patientsRepository.items.find((patient) =>
        patient.id.equal(dispensation.patientId),
      )

      if (!patient) {
        throw new Error('Pacient não encontrado.')
      }

      return DispensationWithPatient.create({
        dispensationDate: dispensation.dispensationDate,
        dispensationId: dispensation.id,
        items: exitsOfDispensation.length,
        operatorId: dispensation.operatorId,
        operator: operator.name,
        patientId: dispensation.operatorId,
        patient: patient.name,
      })
    })

    return {
      dispensations: dispensationsMapped,
      meta: {
        page,
        totalCount: dispensationsFiltered.length,
      },
    }
  }

  async getDispensationMetrics(institutionId: string): Promise<{
    today: { total: number; percentageAboveAverage: number };
    month: { total: number; percentageComparedToLastMonth: number };
  }> {
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const dispensations = this.items
    const todayDispensations = dispensations.filter(
      (d) =>
        d.dispensationDate >= todayStart &&
        d.dispensationDate <
          new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
    )
    const todayTotal = todayDispensations.length

    const daysSoFar = now.getDate() - 1 || 1
    const monthDispensations = dispensations.filter(
      (d) =>
        d.dispensationDate >= monthStart && d.dispensationDate < todayStart,
    )
    const averagePerDay = monthDispensations.length / daysSoFar

    const percentageAboveAverage =
      averagePerDay === 0
        ? 100
        : ((todayTotal - averagePerDay) / averagePerDay) * 100

    const thisMonthDispensations = dispensations.filter(
      (d) => d.dispensationDate >= monthStart && d.dispensationDate <= now,
    )
    const thisMonthTotal = thisMonthDispensations.length

    const lastMonthDispensations = dispensations.filter(
      (d) =>
        d.dispensationDate >= lastMonthStart &&
        d.dispensationDate <= lastMonthEnd,
    )
    const lastMonthTotal = lastMonthDispensations.length

    const percentageComparedToLastMonth =
      lastMonthTotal === 0
        ? 100
        : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100

    return {
      today: {
        total: todayTotal,
        percentageAboveAverage,
      },
      month: {
        total: thisMonthTotal,
        percentageComparedToLastMonth,
      },
    }
  }

  async getDispensationsInAPeriod(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
    patientId?: string,
    operatorId?: string,
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: MetaReport }> {
    const dispensations = this.items
    const dispensationsFiltered = dispensations
      .filter((dispensation) => {
        const exit = this.exitsRepository.items.find((exit) =>
          exit.dispensationId?.equal(dispensation.id),
        )
        if (!exit) {
          throw new Error('Exit not found for dispensation.')
        }

        const medicineStock = this.medicinesStocksRepository.items.find(
          (stock) => stock.id.equal(exit.medicineStockId),
        )

        if (!medicineStock) {
          throw new Error('Medicine stock not found for exit.')
        }

        const stock = this.stocksRepository.items.find((stock) =>
          stock.id.equal(medicineStock.stockId),
        )

        if (!stock) {
          throw new Error('Stock not found for medicine stock.')
        }

        if (!stock.institutionId.equal(new UniqueEntityId(institutionId))) {
          return false
        }
        if (
          startDate &&
          dispensation.dispensationDate <
            new Date(startDate.setHours(0, 0, 0, 0))
        ) {
          return false
        }
        if (
          endDate &&
          dispensation.dispensationDate >
            new Date(endDate.setHours(23, 59, 59, 999))
        ) {
          return false
        }

        if (
          patientId &&
          !dispensation.patientId.equal(new UniqueEntityId(patientId))
        ) {
          return false
        }

        if (
          operatorId &&
          !dispensation.operatorId.equal(new UniqueEntityId(operatorId))
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const dispensationsMapped = dispensationsFiltered.map((dispensation) => {
      const exitsOfDispensation = this.exitsRepository.items.filter((exit) =>
        exit.dispensationId?.equal(dispensation.id),
      )

      const operator = this.operatorsRepository.items.find((operator) =>
        operator.id.equal(dispensation.operatorId),
      )

      if (!operator) {
        throw new Error('Operador não encontrado.')
      }

      const patient = this.patientsRepository.items.find((patient) =>
        patient.id.equal(dispensation.patientId),
      )

      if (!patient) {
        throw new Error('Pacient não encontrado.')
      }

      return DispensationWithPatient.create({
        dispensationDate: dispensation.dispensationDate,
        dispensationId: dispensation.id,
        items: exitsOfDispensation.length,
        operatorId: dispensation.operatorId,
        operator: operator.name,
        patientId: dispensation.operatorId,
        patient: patient.name,
      })
    })

    return {
      dispensations: dispensationsMapped,
      meta: {
        totalCount: dispensationsFiltered.length,
      },
    }
  }

  async fetchDispensesPerDay(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ dispenses: DispensationPerDay[]; meta: MetaReport }> {
    const dispensations = this.items
      .filter((dispensation) => {
        const exit = this.exitsRepository.items.find((exit) =>
          exit.dispensationId?.equal(dispensation.id),
        )
        if (!exit) {
          throw new Error('Exit not found for dispensation.')
        }

        const medicineStock = this.medicinesStocksRepository.items.find(
          (stock) => stock.id.equal(exit.medicineStockId),
        )

        if (!medicineStock) {
          throw new Error('Medicine stock not found for exit.')
        }

        const stock = this.stocksRepository.items.find((stock) =>
          stock.id.equal(medicineStock.stockId),
        )

        if (!stock) {
          throw new Error('Stock not found for medicine stock.')
        }

        if (!stock.institutionId.equal(new UniqueEntityId(institutionId))) {
          return false
        }
        if (
          startDate &&
          dispensation.dispensationDate <
            new Date(startDate.setHours(0, 0, 0, 0))
        ) {
          return false
        }
        if (
          endDate &&
          dispensation.dispensationDate >
            new Date(endDate.setHours(23, 59, 59, 999))
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const dispensationsPerDay: DispensationPerDay[] = []

    dispensations.forEach((dispensation) => {
      const dateKey = dispensation.dispensationDate.toISOString().split('T')[0]
      const existingEntry = dispensationsPerDay.find(
        (entry) =>
          entry.dispensationDate.toISOString().split('T')[0] === dateKey,
      )

      if (existingEntry) {
        existingEntry.total += 1
      } else {
        dispensationsPerDay.push({
          dispensationDate: new Date(dateKey),
          total: 1,
        })
      }
    })

    return {
      dispenses: dispensationsPerDay,
      meta: {
        totalCount: dispensations.length,
      },
    }
  }

  async fetchMostTreatedPathologies(
    institutionId?: string,
  ): Promise<{ mostTreatedPathologies: MostTreatedPathology[] }> {
  // Mapeia patologiaId -> { name, count }
    const pathologyCount: Record<string, { name: string; count: number }> = {}

    // Filtra dispensas pela instituição, se necessário
    const dispensations = this.items.filter((dispensation) => {
      if (!institutionId) return true
      const exit = this.exitsRepository.items.find((exit) =>
        exit.dispensationId?.equal(dispensation.id),
      )
      if (!exit) return false
      const medicineStock = this.medicinesStocksRepository.items.find(
        (stock) => stock.id.equal(exit.medicineStockId),
      )
      if (!medicineStock) return false
      const stock = this.stocksRepository.items.find((stock) =>
        stock.id.equal(medicineStock.stockId),
      )
      if (!stock) return false
      return stock.institutionId.equal(new UniqueEntityId(institutionId))
    })

    // Conta patologias
    for (const dispensation of dispensations) {
      const patient = this.patientsRepository.items.find((p) =>
        p.id.equal(dispensation.patientId),
      )
      if (!patient) continue
      for (const pathologyId of patient.pathologiesIds) {
        const id = pathologyId.toString()
        // Aqui você pode buscar o nome real da patologia se tiver um repositório de patologias
        const pathology = this.pathologiesRepository.items.find((p) =>
          p.id.equal(pathologyId),
        )
        if (!pathology) {
          throw new Error(`Pathology with id ${id} not found`)
        }
        const pathologyName = pathology.content

        if (!pathologyCount[id]) {
          pathologyCount[id] = { name: pathologyName, count: 0 }
        }
        pathologyCount[id].count++
      }
    }

    // Monta array e ordena
    const allPathologies = Object.entries(pathologyCount)
      .map(([id, { name, count }]) => ({
        pathologyId: id,
        pathologyName: name,
        total: count,
        percentage: 0, // inicializa com 0, será atualizado abaixo
      }))
      .sort((a, b) => b.total - a.total)

    const totalDispensations = allPathologies.reduce((sum, p) => sum + p.total, 0)

    allPathologies.forEach(p => {
      p.percentage = totalDispensations > 0
        ? (p.total / totalDispensations) * 100
        : 0
    })

    // Pega as 4 primeiras, soma o resto como "Outros"
    const top4 = allPathologies.slice(0, 4)
    const othersTotal = allPathologies.slice(4).reduce((sum, p) => sum + p.total, 0)
    const othersPercentage = totalDispensations > 0
      ? (othersTotal / totalDispensations) * 100
      : 0

    const result: MostTreatedPathology[] = [...top4]
    if (othersTotal > 0) {
      result.push({
        pathologyId: 'others',
        pathologyName: 'Outros',
        total: othersTotal,
        percentage: othersPercentage,
      })
    }

    return { mostTreatedPathologies: result }
  }
}
