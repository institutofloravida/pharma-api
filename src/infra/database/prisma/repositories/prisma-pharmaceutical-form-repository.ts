import { PaginationParams } from '@/core/repositories/pagination-params'
import { PharmaceuticalFormsRepository } from '@/domain/pharma/application/repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PrismaService } from '../prisma.service'
import { PrismaPharmaceuticalFormMapper } from '../mappers/prisma-pharmaceutical-form'
import { Injectable } from '@nestjs/common'
import type { Meta } from '@/core/repositories/meta'

@Injectable()
export class PrismaPharmaceuticalFormsRepository implements PharmaceuticalFormsRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(pharmaceuticalForm: PharmaceuticalForm): Promise<void> {
    await this.prisma.pharmaceuticalForm.create({
      data: PrismaPharmaceuticalFormMapper.toPrisma(pharmaceuticalForm),
    })
  }

  async findByContent(content: string): Promise<PharmaceuticalForm | null> {
    const pharmaceuticalForm = await this.prisma.pharmaceuticalForm.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },

    })

    if (!pharmaceuticalForm) {
      return null
    }

    return PrismaPharmaceuticalFormMapper.toDomain(pharmaceuticalForm)
  }

  async findMany({ page }: PaginationParams, content?: string): Promise<{
    pharmaceuticalForms: PharmaceuticalForm[]
    meta: Meta
  }> {
    const pageSize = 20

    const pharmaceuticalForms = await this.prisma.pharmaceuticalForm.findMany({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',

        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    })

    const totalCount = await this.prisma.pharmaceuticalForm.count({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
    })

    const pharmaceuticalFormMappered = pharmaceuticalForms.map(PrismaPharmaceuticalFormMapper.toDomain)

    return {
      pharmaceuticalForms: pharmaceuticalFormMappered,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
