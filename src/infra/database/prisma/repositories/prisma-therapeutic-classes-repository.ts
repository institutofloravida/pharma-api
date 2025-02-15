import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { PrismaService } from '../prisma.service'
import { PrismaTherapeuticClassMapper } from '../mappers/prisma-therapeutic-class.mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import type { Meta } from '@/core/repositories/meta'
import type { Prisma } from '@prisma/client'

@Injectable()
export class PrismaTherapeuticClassesRepository
implements TherapeuticClassesRepository {
  constructor(private prisma: PrismaService) {}

  async create(therapeuticClass: TherapeuticClass) {
    await this.prisma.therapeuticClass.create({
      data: PrismaTherapeuticClassMapper.toPrisma(therapeuticClass),
    })
  }

  async save(therapeuticClass: TherapeuticClass): Promise<void> {
    const data = PrismaTherapeuticClassMapper.toPrisma(therapeuticClass)

    await this.prisma.therapeuticClass.update({
      where: {
        id: therapeuticClass.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<TherapeuticClass | null> {
    const therapeuticClass = await this.prisma.therapeuticClass.findUnique({
      where: {
        id,
      },
    })

    if (!therapeuticClass) return null

    return PrismaTherapeuticClassMapper.toDomain(therapeuticClass)
  }

  async findByContent(content: string): Promise<TherapeuticClass | null> {
    const therapeuticClass = await this.prisma.therapeuticClass.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },
    })

    if (!therapeuticClass) {
      return null
    }

    return PrismaTherapeuticClassMapper.toDomain(therapeuticClass)
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string },
  ): Promise<{ therapeuticClasses: TherapeuticClass[]; meta: Meta }> {
    const { content } = filters

    const whereClause: Prisma.TherapeuticClassWhereInput = {
      name: {
        contains: content,
        mode: 'insensitive',
      },
    }

    const [therapeuticClasses, totalCount] = await this.prisma.$transaction([
      this.prisma.therapeuticClass.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.therapeuticClass.count({
        where: whereClause,
      }),
    ])

    return {
      therapeuticClasses: therapeuticClasses.map(PrismaTherapeuticClassMapper.toDomain),
      meta: {
        page, totalCount,
      },
    }
  }
}
