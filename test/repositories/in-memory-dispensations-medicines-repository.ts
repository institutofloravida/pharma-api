import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository'
import { InMemoryOperatorsRepository } from './in-memory-operators-repository'
import { InMemoryPatientsRepository } from './in-memory-patients-repository'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'

export class InMemoryDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  public items: Dispensation[] = []
  constructor(
    private exitsRepository: InMemoryMedicinesExitsRepository,
    private operatorsRepository: InMemoryOperatorsRepository,
    private patientsRepository: InMemoryPatientsRepository,
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
}

/*

const dispensationFilteredByMedicineId: DispensationDetails[] = []
    for (const dispensation of this.items) {
      const exit = this.exitsRepository.items.find((exit) =>
        exit.dispensationId?.equal(dispensation.id),
      )
      if (!exit) {
        throw new Error('Nenhuma saída identificada para essa dispensa!')
      }

      const medicineStock = this.medicineStockRepository.items.find((item) =>
        item.id.equal(medicineStock.id),
      )

      if (!medicineStock) {
        throw new Error('Estoque de medicamento não encontrado.')
      }

      const medicineVariant = this.medicinesVariantsRepository.items.find(
        (item) => item.id.equal(medicineStock.medicineVariantId),
      )

      if (!medicineVariant) {
        throw new Error('Variante não encontrada.')
      }

      const pharmaceuticalForm = this.pharmaceuticalFormsRepository.items.find(
        (item) => item.id.equal(medicineStock.pharmaceuticalFormId),
      )

      if (!pharmaceuticalForm) {
        throw new Error('Variante não encontrada.')
      }

      const unitMeasure = this.unitsMeasureRepository.items.find(
        (item) => item.id.equal(medicineStock.unitMeasureId),
      )

      if (!unitMeasure) {
        throw new Error('Variante não encontrada.')
      }

      const medicine = this.medicinesRepository.items.find((item) =>
        item.id.equal(medicineVariant.medicineId),
      )

      if (!medicine) {
        throw new Error('Medicamento não encontrado.')
      }

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
        throw new Error('Operador não encontrado.')
      }

      if (medicineId && medicine.id.equal(new UniqueEntityId(medicineId))) {
        const dispensationDetails = DispensationDetails.create({
          dispensationId: dispensation.id,
          dispensationDate: dispensation.dispensationDate,
          medicine: {
            name: medicine.content,
            dosage: medicineVariant.dosage,
            pharmaceuticaForm: pharmaceuticalForm.content,
            unitMeasure: unitMeasure.acronym,
            quantity: dispensation.
          },
          operatorId: dispensation.operatorId,
          operator: operator.name,
          patientId: dispensation.patientId,
          patient: patient.name,
        })
        dispensationFilteredByMedicineId.push(dispensation)
      }
    }
*/
