import type { UseCaseError } from '@/core/erros/use-case-error'

export class InsufficientQuantityInStockError extends Error implements UseCaseError {
  constructor(identifier: string, quantity: number) {
    super(`qunatity of medicine ${identifier} in stock: ${quantity}`)
  }
}
