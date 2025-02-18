import { UseCaseError } from '@/core/erros/use-case-error'

export class UnitMeasureNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Unidade de medida com id "${id}" não foi encontrada.`)
  }
}
