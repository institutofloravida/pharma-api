import { UseCaseError } from '@/core/erros/use-case-error'

export class PharmaceuticalFormAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Forma farmacêutica ${content} já existe.`)
  }
}
