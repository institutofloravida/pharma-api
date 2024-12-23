import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'

export class InMemoryPatientsRepository implements PatientsRepository {
  public items: Patient[] = []

  async create(patient: Patient) {
    this.items.push(patient)
  }

  async findById(id: string) {
    const patient = this.items.find(item => item.id.toString() === id)
    if (patient) {
      return patient
    }
    return null
  }

  async findByCpf(cpf: string) {
    const patient = this.items.find(item => item.cpf.toString() === cpf)
    if (patient) {
      return patient
    }
    return null
  }

  async findBySus(sus: string) {
    const patient = this.items.find(item => item.sus.toString() === sus)
    if (patient) {
      return patient
    }
    return null
  }
}
