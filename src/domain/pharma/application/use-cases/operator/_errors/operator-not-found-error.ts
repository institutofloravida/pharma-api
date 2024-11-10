import { UseCaseError } from '@/core/erros/use-case-error'

export class OperatorNotFoundError extends Error implements UseCaseError {
  constructor(identifier:string) {
    super(`Operator with id ${identifier} not found.`)
  }
}
