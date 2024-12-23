import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  create(patient: Patient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Patient | null> {
    throw new Error('Method not implemented.')
  }

  findByCpf(cpf: string): Promise<Patient | null> {
    throw new Error('Method not implemented.')
  }

  findBySus(sus: string): Promise<Patient | null> {
    throw new Error('Method not implemented.')
  }
}
