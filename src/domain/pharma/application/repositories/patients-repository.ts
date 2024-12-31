import { PaginationParams } from '@/core/repositories/pagination-params'
import { Patient } from '../../enterprise/entities/patient'
import { Meta } from '@/core/repositories/meta'

export abstract class PatientsRepository {
  abstract create(patient: Patient): Promise<void>
  abstract findById(id: string): Promise<Patient | null>
  abstract findByCpf(cpf: string): Promise<Patient | null>
  abstract findBySus(sus: string): Promise<Patient | null>
  abstract findMany(
    params: PaginationParams,
    name?: string,
    cpf?: string,
    sus?: string,
    birthDate?: Date,
    generalRegistration?: string,
  ): Promise<{ patients: Patient[]; meta: Meta }>
}
