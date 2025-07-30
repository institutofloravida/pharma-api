import { UseCaseError } from '@/core/erros/use-case-error'

export class PharmaceuticalFormHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Existem dependências vinculadas a essa forma farmacêutica.')
  }
}
