import { UseCaseError } from '@/core/erros/use-case-error'

export class UnitMeasureWithSameAcronymAlreadyExistsError extends Error implements UseCaseError {
  constructor(acronym: string) {
    super(`Unidade de medida com abreviação "${acronym}" já existe`)
  }
}
