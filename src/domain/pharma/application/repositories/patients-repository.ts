import { Patient } from '../../enterprise/entities/patient'

export abstract class PatientsRepository {
  abstract create(patient: Patient): Promise<void>
  abstract findById(id: string): Promise<Patient | null>
  abstract findByCpf(cpf: string): Promise<Patient | null>
  abstract findBySus(sus: string): Promise<Patient | null>
}
