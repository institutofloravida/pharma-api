import { UseCaseError } from '@/core/erros/use-case-error'

export class TherapeuticClassHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Esse registro possui dependências!')
  }
}
