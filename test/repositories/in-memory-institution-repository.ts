import type { InstitutionRepository } from '@/domain/pharma/application/repositories/institution-repository'
import type { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InMemoryInstitutionRepository implements InstitutionRepository {
  public items: Institution[] = []

  async create(institution: Institution) {
    this.items.push(institution)
  }

  async findByContent(content: string) {
    const institution = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!institution) {
      return null
    }

    return institution
  }

  async findByCnpj(cnpj: string) {
    const institution = this.items.find(item => item.cnpj.toLowerCase() === cnpj.toLowerCase().trim())

    if (!institution) {
      return null
    }

    return institution
  }
}
