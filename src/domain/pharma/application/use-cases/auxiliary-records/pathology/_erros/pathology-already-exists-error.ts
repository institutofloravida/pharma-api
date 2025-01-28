import { UseCaseError } from '@/core/erros/use-case-error'

export class PathologyAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`pathology with content ${content} already exists `)
  }
}
