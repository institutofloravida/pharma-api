import { UseCaseError } from '@/core/erros/use-case-error'

export class UseMedicineAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Utilização já existente.')
  }
}
