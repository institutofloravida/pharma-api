import { UseCaseError } from '@/core/erros/use-case-error'

export class ManufacturerHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Existem lotes associados a esse fabricante. ')
  }
}
