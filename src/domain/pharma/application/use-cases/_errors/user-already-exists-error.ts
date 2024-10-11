import type { UseCaseError } from '@/core/erros/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(message:string) {
    super(message)
  }
}
