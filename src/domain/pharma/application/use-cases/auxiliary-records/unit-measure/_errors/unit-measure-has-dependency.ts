import { UseCaseError } from '@/core/erros/use-case-error'

export class UnitMeasureHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Esse registro possui dependências!')
  }
}
