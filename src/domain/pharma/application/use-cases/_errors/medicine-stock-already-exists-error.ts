import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineStockAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier:string) {
    super(`Medicine Stock ${identifier} already exists.`)
  }
}
