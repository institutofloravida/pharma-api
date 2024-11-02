import { Pathology } from '../../enterprise/entities/pathology'

export abstract class PathologiesRepository {
  abstract create(pathology: Pathology): Promise<void>
  abstract findById(email: string): Promise<Pathology | null>
}
