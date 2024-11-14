import { PaginationParams } from '@/core/repositories/pagination-params'
import { PharmaceuticalFormsRepository } from '@/domain/pharma/application/repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PrismaService } from '../prisma.service'
import { PrismaPharmaceuticalFormMapper } from '../mappers/prisma-pharmaceutical-form'
import { Injectable } from '@nestjs/common'

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

  async findMany({ page }: PaginationParams): Promise<PharmaceuticalForm[]> {
    const pharmaceuticalFormes = await this.prisma.pharmaceuticalForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return pharmaceuticalFormes.map(PrismaPharmaceuticalFormMapper.toDomain)
  }
}
