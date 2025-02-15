import { UseCaseError } from '@/core/erros/use-case-error'

export class PharmaceuticalFormNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Forma farmacêutica com id ${id} não foi encontrada.`)
  }
}
