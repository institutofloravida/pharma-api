import { UseCaseError } from '@/core/erros/use-case-error'

export class NoAssociatedInstitutionError extends Error implements UseCaseError {
  constructor() {
    super('At least one institution must be associated with the operator')
  }
}
