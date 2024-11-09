import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { PrismaService } from '../prisma.service'
import { PrismaTherapeuticClassMapper } from '../mappers/prisma-therapeutic-class.mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaTherapeuticClassesRepository implements TherapeuticClassesRepository {
  constructor(private prisma: PrismaService) {}

  async create(therapeuticClass: TherapeuticClass) {
    await this.prisma.therapeuticClass.create({
      data: PrismaTherapeuticClassMapper.toPrisma(therapeuticClass),
    })
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

  async findMany({ page }: PaginationParams): Promise<TherapeuticClass[]> {
    const therapeuticClasses = await this.prisma.therapeuticClass.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return therapeuticClasses.map(PrismaTherapeuticClassMapper.toDomain)
  }
}
