import type { UseCaseError } from '@/core/erros/use-case-error'

export class InvalidEntryQuantityError extends Error implements UseCaseError {
  constructor() {
    super('The quantity for an entry must be greater than zero.')
  }
}
