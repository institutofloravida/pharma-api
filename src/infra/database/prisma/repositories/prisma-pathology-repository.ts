import { PaginationParams } from '@/core/repositories/pagination-params'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaPathologyMapper } from '../mappers/prisma-pathology-mapper'
import { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'
import { Meta } from '@/core/repositories/meta'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaPathologysRepository implements PathologiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(pathology: Pathology) {
    const data = PrismaPathologyMapper.toPrisma(pathology)
    await this.prisma.pathology.create({
      data,
    })
  }

  async findById(id: string): Promise<Pathology | null> {
    const pathology = await this.prisma.pathology.findFirst({
      where: {
        id,
      },
    })

    if (!pathology) {
      return null
    }

    return PrismaPathologyMapper.toDomain(pathology)
  }

  async findByContent(content: string) {
    const pathology = await this.prisma.pathology.findFirst({
      where: {
        name: {
          equals: content.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!pathology) {
      return null
    }

    return PrismaPathologyMapper.toDomain(pathology)
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ pathologies: Pathology[]; meta: Meta }> {
    const pageSize = 20
    const whereClause: Prisma.PathologyWhereInput = {
      name: {
        contains: content ?? '',
        mode: Prisma.QueryMode.insensitive,
      },
    }

    const [pathologies, totalCount] = await this.prisma.$transaction([
      this.prisma.pathology.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pathology.count({ where: whereClause }),
    ])

    return {
      pathologies: pathologies.map(PrismaPathologyMapper.toDomain),
      meta: {
        page,
        totalCount,
      },
    }
  }
}
