import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaInstitutionMapper } from '../mappers/prisma-institution-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Meta } from '@/core/repositories/meta'

@Injectable()
export class PrismaInstitutionsRepository implements InstitutionsRepository {
  constructor(private prisma: PrismaService) {}
  async save(institution: Institution): Promise<void> {
    const data = PrismaInstitutionMapper.toPrisma(institution)
    await this.prisma.institution.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(institution: Institution): Promise<void> {
    const data = PrismaInstitutionMapper.toPrisma(institution)
    await this.prisma.institution.create({
      data,
    })
  }

  async findById(id: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findFirst({
      where: {
        id,
      },
    })
    if (!institution) {
      return null
    }
    return PrismaInstitutionMapper.toDomain(institution)
  }

  async findByContent(content: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },
    })

    if (!institution) {
      return null
    }

    return PrismaInstitutionMapper.toDomain(institution)
  }

  async findByCnpj(cnpj: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findUnique({
      where: {
        cnpj,
      },
    })

    if (!institution) {
      return null
    }

    return PrismaInstitutionMapper.toDomain(institution)
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ institutions: Institution[]; meta: Meta }> {
    const [institutions, institutionsTotalCount] = await Promise.all([
      this.prisma.institution.findMany({
        where: {
          name: {
            contains: content ?? '',
            mode: 'insensitive',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.institution.count({
        where: {
          name: {
            contains: content ?? '',
            mode: 'insensitive',
          },
        },
      }),

    ])

    return {
      institutions: institutions.map(PrismaInstitutionMapper.toDomain),
      meta: {
        page,
        totalCount: institutionsTotalCount,
      },
    }
  }
}
