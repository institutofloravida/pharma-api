import type { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

export class InMemoryPathologiesRepository implements PathologiesRepository {
  public items: Pathology[] = []

  async create(pathology: Pathology) {
    this.items.push(pathology)
  }

  async save(pathology: Pathology): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id.equal(pathology.id))

    this.items[itemIndex] = pathology
  }

  async delete(pathology: Pathology): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id.equal(pathology.id))

    this.items.splice(itemIndex)
  }

  async findById(id: string) {
    const pathology = this.items.find((item) => item.id.toString() === id)

    if (!pathology) {
      return null
    }

    return pathology
  }

  async findByContent(content: string): Promise<Pathology | null> {
    const pathology = this.items.find(
      (item) => item.content.toLowerCase() === content.toLowerCase().trim(),
    )
    if (!pathology) {
      return null
    }

    return pathology
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ pathologies: Pathology[]; meta: Meta }> {
    const pathologiesFiltered = this.items
      .filter((pathololy) => {
        return pathololy.content.includes(content ?? '')
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const pathologiesPaginated = pathologiesFiltered.slice(
      (page - 1) * 20,
      page * 20,
    )

    return {
      pathologies: pathologiesPaginated,
      meta: {
        page,
        totalCount: pathologiesFiltered.length,
      },
    }
  }
}
