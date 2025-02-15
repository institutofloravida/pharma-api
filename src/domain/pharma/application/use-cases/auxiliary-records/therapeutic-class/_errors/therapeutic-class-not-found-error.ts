import { UseCaseError } from '@/core/erros/use-case-error'

export class TherapeuticClassNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Classe terapeutica com id ${id} não foi encontrada`)
  }
}
