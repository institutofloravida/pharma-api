import { PaginationParams } from '@/core/repositories/pagination-params';
import { Pathology } from '../../enterprise/entities/pathology'

export abstract class PathologiesRepository {
  abstract create(pathology: Pathology): Promise<void>
  abstract findById(email: string): Promise<Pathology | null>
  abstract findByContent(content: string): Promise<Pathology | null>
  abstract findMany(params: PaginationParams): Promise<Pathology[]>
}
