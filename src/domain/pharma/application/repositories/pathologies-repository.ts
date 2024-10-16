import type { Pathology } from '../../enterprise/entities/pathology'

export interface PathologiesRepository {
  create(pathology: Pathology): Promise<void>
  findById(email: string): Promise<Pathology | null>
}
