import { UseCaseError } from '@/core/erros/use-case-error'

export class PatientNotFoundError extends Error implements UseCaseError {
  constructor(id:string) {
    super(`Paciente com id '${id}' não encontrado.`)
  }
}
