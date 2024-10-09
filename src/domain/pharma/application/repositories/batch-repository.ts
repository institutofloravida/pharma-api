import type { Batch } from '../../enterprise/entities/batch'

export interface BatchRepository {
  create(batch: Batch): Promise<void>
  findById(id:string): Promise<Batch | null>
}
