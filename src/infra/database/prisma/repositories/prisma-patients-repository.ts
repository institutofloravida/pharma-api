import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PatientsRepository } from '@/domain/pharma/application/repositories/patients-repository'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  findMany(params: PaginationParams, name?: string, cpf?: string, sus?: string, birthDate?: Date, generalRegistration?: string): Promise<{ patients: Patient[]; meta: Meta }> {
    throw new Error('Method not implemented.')
  }

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
