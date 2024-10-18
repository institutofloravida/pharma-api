import type { Batch } from '../../enterprise/entities/batch'

export interface BatchsRepository {
  create(batch: Batch): Promise<void>
  findById(id:string): Promise<Batch | null>
}
