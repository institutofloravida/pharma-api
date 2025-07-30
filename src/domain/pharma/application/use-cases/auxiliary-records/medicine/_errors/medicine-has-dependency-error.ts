import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Existem dependências vinculadas a esse medicamento.')
  }
}
