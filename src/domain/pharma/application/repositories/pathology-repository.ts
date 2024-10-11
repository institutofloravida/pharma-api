import type { Pathology } from '../../enterprise/entities/pathology'

export interface PathologyRepository {
  create(pathology: Pathology): Promise<void>
  findById(email: string): Promise<Pathology | null>
}
