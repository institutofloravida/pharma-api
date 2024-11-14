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

  async findMany({ page }: PaginationParams): Promise<PharmaceuticalForm[]> {
    const pharmaceuticalForms = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return pharmaceuticalForms
  }
}
