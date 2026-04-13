import { UseCaseError } from '@/core/erros/use-case-error'

export class BatchAlreadyExistsError extends Error implements UseCaseError {
  constructor(code: string) {
    super(`Batch with code ${code} already exists for this manufacturer`)
  }
}
