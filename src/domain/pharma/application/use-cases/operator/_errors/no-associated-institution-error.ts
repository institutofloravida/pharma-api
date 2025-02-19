import { UseCaseError } from '@/core/erros/use-case-error'

export class NoAssociatedInstitutionError extends Error implements UseCaseError {
  constructor() {
    super('Pelo menos uma instituição deve ser associada ao usuário')
  }
}
