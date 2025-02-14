import { UseCaseError } from '@/core/erros/use-case-error'

export class InstitutionNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Instituição com id ${id} não foi encontrada!`)
  }
}
