import { Batch } from '../../enterprise/entities/batch'

export abstract class BatchesRepository {
  abstract create(batch: Batch): Promise<void>
  abstract findById(id:string): Promise<Batch | null>
}
