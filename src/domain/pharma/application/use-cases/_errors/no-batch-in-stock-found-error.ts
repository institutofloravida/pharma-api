import { UseCaseError } from '@/core/erros/use-case-error'

export class NoBatchInStockFoundError extends Error implements UseCaseError {
  constructor(identifier:string) {
    super(`No batch in stock found for medicine ${identifier}.`)
  }
}
