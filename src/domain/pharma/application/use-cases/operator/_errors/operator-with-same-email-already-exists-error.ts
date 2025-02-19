import { UseCaseError } from '@/core/erros/use-case-error'

export class OperatorWithSameEmailAlreadyExistsError extends Error implements UseCaseError {
  constructor(email:string) {
    super(`Operador com email "${email}" já existe`)
  }
}
