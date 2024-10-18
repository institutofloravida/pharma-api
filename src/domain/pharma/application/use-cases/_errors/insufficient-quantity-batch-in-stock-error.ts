import type { UseCaseError } from '@/core/erros/use-case-error'

export class InsufficientQuantityBatchInStockError extends Error implements UseCaseError {
  constructor(identifier: string, batch: string, quantity: number) {
    super(`batch quantity ${batch} of the medicine ${identifier}: ${quantity}`)
  }
}
