import { Batch } from '@/domain/pharma/enterprise/entities/batch'

export class BatchPresenter {
  static toHTTP(batch: Batch) {
    return {
      id: batch.id.toString(),
      code: batch.code,
      manufacturerId: batch.manufacturerId.toString(),
      manufacturingDate: batch.manufacturingDate,
      expirationDate: batch.expirationDate,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    }
  }
}
