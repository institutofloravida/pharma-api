import type { PathologyRepository } from '@/domain/pharma/application/repositories/pathology-repository'
import type { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

export class InMemoryPathologyRepository implements PathologyRepository {
  public items: Pathology[] = []

  async create(pathology: Pathology) {
    this.items.push(pathology)
  }

  async findById(id: string) {
    const pathology = this.items.find(item => item.id.toString() === id)

    if (!pathology) {
      return null
    }

    return pathology
  }
}
