import { UseCaseError } from '@/core/erros/use-case-error'

export class ManufacturerWithSameCnpjAlreadyExistsError extends Error implements UseCaseError {
  constructor(cnpj: string) {
    super(` Já existe um fabricante com o CNPJ ${cnpj} `)
  }
}
