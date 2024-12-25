import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InMemoryInstitutionsRepository implements InstitutionsRepository {
  public items: Institution[] = []

  async findById(id: string): Promise<Institution | null> {
    const institution = this.items.find(item => item.id.toValue() === id)

    if (!institution) {
      return null
    }

    return institution
  }

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

  async findMany({ page }: PaginationParams, content?: string): Promise<{ institutions: Institution[]; meta: Meta }> {
    const institutions = this.items
      .filter(item => item.content.includes(content ?? ''))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const institutionsPaginated = institutions
      .slice((page - 1) * 20, page * 20)

    return {
      institutions: institutionsPaginated,
      meta: {
        page,
        totalCount: institutions.length,
      },
    }
  }
}
