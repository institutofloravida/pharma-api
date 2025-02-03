import { UseCaseError } from '@/core/erros/use-case-error'

export class InstitutionNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('Institution not exists!')
  }
}
