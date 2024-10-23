import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InMemoryInstitutionsRepository implements InstitutionsRepository {
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
