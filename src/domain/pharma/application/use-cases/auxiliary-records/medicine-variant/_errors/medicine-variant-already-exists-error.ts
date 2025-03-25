import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineVariantAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('A variante já existe!"')
  }
}
