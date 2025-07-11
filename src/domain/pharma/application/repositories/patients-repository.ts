import { PaginationParams } from '@/core/repositories/pagination-params'
import { Patient } from '../../enterprise/entities/patient'
import { Meta } from '@/core/repositories/meta'
import { PatientDetails } from '../../enterprise/entities/value-objects/patient-details'

export abstract class PatientsRepository {
  abstract create(patient: Patient): Promise<void>
  abstract save(patient: Patient): Promise<void>
  abstract savePathologies(patientId: string, pathologiesIds: string[]): Promise<void | null>
  abstract findById(id: string): Promise<Patient | null>
  abstract findByIdWithDetails(id: string): Promise<PatientDetails | null>
  abstract findByCpf(cpf: string): Promise<Patient | null>
  abstract findBySus(sus: string): Promise<Patient | null>
  abstract findMany(
    params: PaginationParams,
    filters: {
      name?: string,
      cpf?: string,
      sus?: string,
      birthDate?: Date,
      generalRegistration?: string,
      pathologyId?: string
    }
  ): Promise<{ patients: Patient[]; meta: Meta }>
  abstract getPatientsMetrics(institutionId: string): Promise<{
    total: number
    receiveMonth: number
  }>
}
