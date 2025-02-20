import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaInstitutionMapper } from '../mappers/prisma-institution-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Meta } from '@/core/repositories/meta'
import { Prisma } from '@prisma/client'

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
    filters: { content?: string, cnpj?: string },
  ): Promise<{ institutions: Institution[]; meta: Meta }> {
    const { cnpj, content } = filters

    const whereClause: Prisma.InstitutionWhereInput = {
      name: {
        contains: content ?? '',
        mode: 'insensitive',
      },
      ...(cnpj && {
        cnpj,
      }),
    }
    const [institutions, totalCount] = await Promise.all([
      this.prisma.institution.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.institution.count({
        where: whereClause,
      }),

    ])

    return {
      institutions: institutions.map(PrismaInstitutionMapper.toDomain),
      meta: {
        page,
        totalCount,
      },
    }
  }
}
