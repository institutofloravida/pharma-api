import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'

export class InMemoryInstitutionsRepository implements InstitutionsRepository {
  public items: Institution[] = []

  async findById(id: string): Promise<Institution | null> {
    const institution = this.items.find((item) => item.id.toValue() === id)

    if (!institution) {
      return null
    }

    return institution
  }

  async create(institution: Institution) {
    this.items.push(institution)
  }

  async save(institution: Institution): Promise<void> {
    const itemIndex = await this.items.findIndex((item) =>
      item.id.equal(institution.id),
    )

    this.items[itemIndex] = institution
  }

  async findByContent(content: string) {
    const institution = this.items.find(
      (item) => item.content.toLowerCase() === content.toLowerCase().trim(),
    )
    if (!institution) {
      return null
    }

    return institution
  }

  async findByCnpj(cnpj: string) {
    const institution = this.items.find(
      (item) => item.cnpj.toLowerCase() === cnpj.toLowerCase().trim(),
    )

    if (!institution) {
      return null
    }

    return institution
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string; cnpj?: string },
  ): Promise<{ institutions: Institution[]; meta: Meta }> {
    const { cnpj, content } = filters

    const institutions = this.items
      .filter((institution) => {
        if (cnpj && !(institution.cnpj === cnpj)) return false

        if (
          content &&
          !institution.content.toLowerCase().includes(content.toLowerCase())
        ) { return false }

        return institution
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const institutionsPaginated = institutions.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      institutions: institutionsPaginated,
      meta: {
        page,
        totalCount: institutions.length,
      },
    }
  }
}
