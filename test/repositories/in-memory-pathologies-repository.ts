import type { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'
import type { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

export class InMemoryPathologiesRepository implements PathologiesRepository {
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
