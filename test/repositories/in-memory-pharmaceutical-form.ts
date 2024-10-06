import type { PharmaceuticalFormRepository } from '@/domain/pharma/application/repositories/pharmaceutical-form-repository'
import type { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'

export class InMemoryPharmaceuticalFormRepository implements PharmaceuticalFormRepository {
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
}
