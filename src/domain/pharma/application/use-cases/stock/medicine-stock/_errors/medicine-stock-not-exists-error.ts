import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineStockNotExistsError extends Error implements UseCaseError {
  constructor(medicineStockId: string) {
    super(`Medicine stock ${medicineStockId} not found`)
  }
}
