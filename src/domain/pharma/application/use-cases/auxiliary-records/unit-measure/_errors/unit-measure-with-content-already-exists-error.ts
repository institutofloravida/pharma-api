import { UseCaseError } from '@/core/erros/use-case-error'

export class UnitMeasureWithSameContentAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Unidade de medida com nome "${content}" já existe`)
  }
}
