import { PaginationParams } from '@/core/repositories/pagination-params'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaPathologyMapper } from '../mappers/prisma-pathology-mapper'
import { PathologiesRepository } from '@/domain/pharma/application/repositories/pathologies-repository'

@Injectable()
export class PrismaPathologysRepository implements PathologiesRepository {
  constructor(private prisma: PrismaService) {
  }

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

  async findMany({ page }: PaginationParams): Promise<Pathology[]> {
    const pathologys = await this.prisma.pathology.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return pathologys.map(PrismaPathologyMapper.toDomain)
  }
}
