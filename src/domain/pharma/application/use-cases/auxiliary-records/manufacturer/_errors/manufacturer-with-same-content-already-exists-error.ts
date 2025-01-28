import { UseCaseError } from '@/core/erros/use-case-error'

export class ManufacturerWithSameContentAlreadyExistsError extends Error implements UseCaseError {
  constructor(content: string) {
    super(`Já existe um fabricante com o nome ${content}`)
  }
}
