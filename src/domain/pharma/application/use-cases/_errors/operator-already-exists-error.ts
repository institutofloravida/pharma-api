import type { UseCaseError } from '@/core/erros/use-case-error'

export class OperatorAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier:string) {
    super(`Operator ${identifier} already exists.`)
  }
}
