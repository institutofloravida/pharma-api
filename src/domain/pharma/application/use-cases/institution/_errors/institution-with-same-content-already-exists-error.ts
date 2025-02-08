import { UseCaseError } from '@/core/erros/use-case-error'

export class InstitutionWithSameContentAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Institution with name ${content} already exists.`)
  }
}
