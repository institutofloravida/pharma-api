import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { InMemoryDispensationsMedicinesRepository } from './in-memory-dispensations-medicines-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PatientDetails } from '@/domain/pharma/enterprise/entities/value-objects/patient-details'
import { InMemoryAddressRepository } from './in-memory-address-repository'
import { InMemoryPathologiesRepository } from './in-memory-pathologies-repository'

export class InMemoryPatientsRepository implements PatientsRepository {
  public items: Patient[] = []

  constructor(
    private addressRepository: InMemoryAddressRepository,
    private pathologiesRepository: InMemoryPathologiesRepository,
  ) {}

  private dispensationsRepository?: InMemoryDispensationsMedicinesRepository

  public setDispensationsRepository(
    repo: InMemoryDispensationsMedicinesRepository,
  ): void {
    this.dispensationsRepository = repo
  }

  async create(patient: Patient) {
    this.items.push(patient)
  }

  async save(patient: Patient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equal(patient.id))

    this.items[itemIndex] = patient
  }

  async savePathologies(
    patientId: string,
    pathologiesIds: string[],
  ): Promise<void | null> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(patientId)),
    )

    this.items[itemIndex].pathologiesIds = pathologiesIds.map(
      (pathology) => new UniqueEntityId(pathology),
    )
  }

  async findById(id: string) {
    const patient = this.items.find((item) => item.id.toString() === id)
    if (patient) {
      return patient
    }
    return null
  }

  async findByIdWithDetails(id: string): Promise<PatientDetails | null> {
    const patient = this.items.find((item) => item.id.toString() === id)
    if (!patient || !patient.addressId) {
      return null
    }

    const address = this.addressRepository.items.find((address) =>
      address.id.equal(patient.addressId ?? new UniqueEntityId()),
    )

    if (!address) {
      return null
    }

    const pathologies = this.pathologiesRepository.items.filter((pathology) =>
      patient.pathologiesIds
        .map((item) => item.toString())
        .includes(pathology.id.toString()),
    )

    const patientDetails = PatientDetails.create({
      patientId: patient.id,
      name: patient.name,
      birthDate: patient.birthDate,
      gender: patient.gender,
      race: patient.race,
      sus: patient.sus,
      cpf: patient.cpf,
      generalRegistration: patient.generalRegistration,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      pathologies,
      address: {
        id: address.id,
        city: address.city,
        neighborhood: address.neighborhood,
        state: address.state,
        number: address.number,
        street: address.street,
        zipCode: address.zipCode,
        complement: address.complement,
      },
    })
    return patientDetails
  }

  async findByCpf(cpf: string) {
    const patient = this.items.find(
      (item) => item.cpf && item.cpf.toString() === cpf,
    )
    if (patient) {
      return patient
    }
    return null
  }

  async findBySus(sus: string) {
    const patient = this.items.find((item) => item.sus.toString() === sus)
    if (patient) {
      return patient
    }
    return null
  }

  private findManyByName(name: string): Patient[] {
    const patients = this.items.filter((item) => {
      return item.name.includes(name)
    })

    return patients
  }

  private findManyByCpf(cpf: string): Patient[] {
    const patients = this.items.filter((item) => {
      return item.cpf && item.cpf.includes(cpf)
    })

    return patients
  }

  private findManyBySus(sus: string): Patient[] {
    const patients = this.items.filter((item) => {
      return item.sus.includes(sus)
    })

    return patients
  }

  private findManyByGeneralRegistration(
    generalRegistration: string,
  ): Patient[] {
    const patients = this.items.filter((item) => {
      return item.generalRegistration?.includes(generalRegistration)
    })

    return patients
  }

  private findManyByBirthDate(birtDate: Date): Patient[] {
    const patients = this.items.filter((item) => {
      return (
        item.birthDate.getDate() === birtDate.getDate() &&
        item.birthDate.getMonth() === birtDate.getMonth() &&
        item.birthDate.getFullYear() === birtDate.getFullYear()
      )
    })

    return patients
  }

  private findManyByPathologyId(pathologyId: string): Patient[] {
    const patients = this.items.filter((patient) => {
      const pathologiesIds = patient.pathologiesIds.map((item) =>
        item.toString(),
      )
      return pathologiesIds.includes(pathologyId)
    })

    return patients
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      name?: string;
      cpf?: string;
      sus?: string;
      birthDate?: Date;
      generalRegistration?: string;
      pathologyId?: string;
    },
  ): Promise<{ patients: Patient[]; meta: Meta }> {
    let patients = this.items
    const { birthDate, cpf, generalRegistration, name, pathologyId, sus } =
      filters

    if (name) {
      patients = this.findManyByName(name)
    }

    if (cpf) {
      patients = this.findManyByCpf(cpf)
    }

    if (sus) {
      patients = this.findManyBySus(sus)
    }

    if (generalRegistration) {
      patients = this.findManyByGeneralRegistration(generalRegistration)
    }

    if (birthDate) {
      patients = this.findManyByBirthDate(birthDate)
    }

    if (pathologyId) {
      patients = this.findManyByPathologyId(pathologyId)
    }

    const patientsPaginated = patients
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)

    return {
      patients: patientsPaginated,
      meta: {
        page,
        totalCount: patients.length,
      },
    }
  }

  async getPatientsMetrics(
    institutionId: string,
  ): Promise<{ total: number; receiveMonth: number }> {
    const patients = this.items

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const receiveMonth = this.dispensationsRepository?.items
      .filter((dispensation) => {
        const createdAt = dispensation.createdAt
        return (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        )
      })
      .reduce((acc: string[], dispensation) => {
        acc.push(dispensation.patientId.toString())
        return acc
      }, [])
    const receiveMonthDistinctPatients = new Set(receiveMonth)

    return {
      total: patients.length,
      receiveMonth: receiveMonthDistinctPatients.size,
    }
  }
}
