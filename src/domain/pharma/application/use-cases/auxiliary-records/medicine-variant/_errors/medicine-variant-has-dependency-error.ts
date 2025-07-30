import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineVariantHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Existem dependências vinculadas a essa variant.')
  }
}
