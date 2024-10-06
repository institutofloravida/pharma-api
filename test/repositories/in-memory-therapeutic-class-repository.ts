import type { TherapeuticClassRepository } from '@/domain/pharma/application/repositories/therapeutic-class-repository'
import type { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'

export class InMemoryTherapeuticClassRepository implements TherapeuticClassRepository {
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
}
