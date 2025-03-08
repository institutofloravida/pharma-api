import { UseCaseError } from '@/core/erros/use-case-error'

export class StockAlreadyExistsError extends Error implements UseCaseError {
  constructor(stockName:string) {
    super(`Já existe um estoque "${stockName}" nessa instituição!`)
  }
}
