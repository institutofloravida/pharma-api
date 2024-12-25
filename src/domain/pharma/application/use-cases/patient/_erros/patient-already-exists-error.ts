import { UseCaseError } from '@/core/erros/use-case-error'

export class PatientAlreadyExistsError extends Error implements UseCaseError {
  constructor(message:string) {
    super(message)
  }
}
