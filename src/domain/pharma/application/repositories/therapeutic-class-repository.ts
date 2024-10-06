import type { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'

export interface TherapeuticClassRepository {
  create(therapeuticClass: TherapeuticClass): Promise<void>
  findByContent(content: string): Promise<TherapeuticClass | null>
}
