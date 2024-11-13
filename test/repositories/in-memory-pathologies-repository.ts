import { PaginationParams } from '@/core/repositories/pagination-params'
import { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

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

  async findByContent(content: string): Promise<Pathology | null> {
    const pathology = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!pathology) {
      return null
    }

    return pathology
  }

  async findMany({page}: PaginationParams): Promise<Pathology[]> {
    const pathologies = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return pathologies

  }
}
