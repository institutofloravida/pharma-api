import { UseCaseError } from '@/core/erros/use-case-error'

export class TherapeuticClassAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Classe terapeutica ${content} já existe`)
  }
}
