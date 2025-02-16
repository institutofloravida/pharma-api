import { UseCaseError } from '@/core/erros/use-case-error'

export class ManufacturerNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(` Fabricante com id ${id} naõ foi encontrado `)
  }
}
