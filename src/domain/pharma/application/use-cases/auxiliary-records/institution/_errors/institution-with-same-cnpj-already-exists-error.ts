import { UseCaseError } from '@/core/erros/use-case-error'

export class InstitutionWithSameCnpjAlreadyExistsError extends Error implements UseCaseError {
  constructor(cnpj: string) {
    super(`Institution with CNPJ ${cnpj} already exists.`)
  }
}
