import { Batch } from '../../enterprise/entities/batch'

export interface BatchesRepository {
  create(batch: Batch): Promise<void>
  findById(id:string): Promise<Batch | null>
}
