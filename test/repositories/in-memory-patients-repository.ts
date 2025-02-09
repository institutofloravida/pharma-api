import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'

export class InMemoryPatientsRepository implements PatientsRepository {
  public items: Patient[] = []

  async create(patient: Patient) {
    this.items.push(patient)
  }

  async findById(id: string) {
    const patient = this.items.find((item) => item.id.toString() === id)
    if (patient) {
      return patient
    }
    return null
  }

  async findByCpf(cpf: string) {
    const patient = this.items.find((item) => item.cpf.toString() === cpf)
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
      return item.cpf.includes(cpf)
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
      const pathologiesIds = patient.pathologiesIds.map(item => item.toString())
      return pathologiesIds.includes(pathologyId)
    })

    return patients
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      name?: string,
      cpf?: string,
      sus?: string,
      birthDate?: Date,
      generalRegistration?: string,
      pathologyId?: string
    },
  ): Promise<{ patients: Patient[]; meta: Meta }> {
    let patients = this.items
    const { birthDate, cpf, generalRegistration, name, pathologyId, sus } = filters

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
}
