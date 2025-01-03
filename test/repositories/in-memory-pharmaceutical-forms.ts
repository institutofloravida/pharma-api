import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PharmaceuticalFormsRepository } from '@/domain/pharma/application/repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'

export class InMemoryPharmaceuticalFormsRepository implements PharmaceuticalFormsRepository {
  public items: PharmaceuticalForm[] = []

  async create(pharmaceuticalForm: PharmaceuticalForm) {
    this.items.push(pharmaceuticalForm)
  }

  async findByContent(content: string) {
    const pharmaceuticalForm = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!pharmaceuticalForm) {
      return null
    }

    return pharmaceuticalForm
  }

  async findMany({ page }: PaginationParams, content?: string): Promise<{
    pharmaceuticalForms: PharmaceuticalForm[]
    meta: Meta
  }> {
    const pharmaceuticalForms = this.items

    const pharmaceuticalFormsFiltred = pharmaceuticalForms
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter(item => item.content.includes(content ?? ''))

    const pharmaceuticalFormsPaginated = pharmaceuticalFormsFiltred
      .slice((page - 1) * 20, page * 20)

    return {
      pharmaceuticalForms: pharmaceuticalFormsPaginated,
      meta: {
        page,
        totalCount: pharmaceuticalFormsFiltred.length,
      },
    }
  }
}
