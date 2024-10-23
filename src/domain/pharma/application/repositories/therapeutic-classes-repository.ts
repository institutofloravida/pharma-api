import { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'

export interface TherapeuticClassesRepository {
  create(therapeuticClass: TherapeuticClass): Promise<void>
  findByContent(content: string): Promise<TherapeuticClass | null>
}
