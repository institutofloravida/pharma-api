import { UseCaseError } from '@/core/erros/use-case-error'

export class InvalidExitQuantityError extends Error implements UseCaseError {
  constructor() {
    super('The quantity for an exit must be greater than zero.')
  }
}
