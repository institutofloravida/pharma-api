import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'

export class InMemoryTherapeuticClassesRepository
implements TherapeuticClassesRepository {
  public items: TherapeuticClass[] = []

  async create(therapeuticClass: TherapeuticClass) {
    this.items.push(therapeuticClass)
  }

  async findByContent(content: string) {
    const therapeuticClass = this.items.find(
      (item) => item.content.toLowerCase() === content.toLowerCase().trim(),
    )
    if (!therapeuticClass) {
      return null
    }

    return therapeuticClass
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string },
  ): Promise<{ therapeuticClasses: TherapeuticClass[]; meta: Meta }> {
    const { content } = filters

    const therapeuticClassesFiltered = this.items
      .filter((therapeuticClass) => {
        return therapeuticClass.content
          .toLowerCase()
          .includes(content?.toLowerCase() ?? '')
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const therapeuticClassesPaginated = therapeuticClassesFiltered.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      therapeuticClasses: therapeuticClassesPaginated,
      meta: {
        page,
        totalCount: therapeuticClassesFiltered.length,
      },
    }
  }
}
