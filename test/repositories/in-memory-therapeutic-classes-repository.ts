import { PaginationParams } from '@/core/repositories/pagination-params'
import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'

export class InMemoryTherapeuticClassesRepository implements TherapeuticClassesRepository {
  public items: TherapeuticClass[] = []

  async create(therapeuticClass: TherapeuticClass) {
    this.items.push(therapeuticClass)
  }

  async findByContent(content: string) {
    const therapeuticClass = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!therapeuticClass) {
      return null
    }

    return therapeuticClass
  }

  async findMany({ page }: PaginationParams): Promise<TherapeuticClass[]> {
    const therapeuticClasses = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page -1) * 10, page * 10)

    return therapeuticClasses
  }
}
