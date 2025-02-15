import { UseCaseError } from '@/core/erros/use-case-error'

export class PathologyNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Pathologia com id ${id} não foi encontrada`)
  }
}
