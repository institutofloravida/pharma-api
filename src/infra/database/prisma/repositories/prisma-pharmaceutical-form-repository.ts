import { PaginationParams } from '@/core/repositories/pagination-params';
import { PharmaceuticalFormsRepository } from '@/domain/pharma/application/repositories/pharmaceutical-forms-repository';
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form';
import { PrismaService } from '../prisma.service';
import { PrismaPharmaceuticalFormMapper } from '../mappers/prisma-pharmaceutical-form';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { Prisma } from 'prisma/generated';

@Injectable()
export class PrismaPharmaceuticalFormsRepository
  implements PharmaceuticalFormsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(pharmaceuticalForm: PharmaceuticalForm): Promise<void> {
    await this.prisma.pharmaceuticalForm.create({
      data: PrismaPharmaceuticalFormMapper.toPrisma(pharmaceuticalForm),
    });
  }

  async save(pharmaceuticalForm: PharmaceuticalForm): Promise<void> {
    const data = PrismaPharmaceuticalFormMapper.toPrisma(pharmaceuticalForm);
    await this.prisma.pharmaceuticalForm.update({
      where: {
        id: pharmaceuticalForm.id.toString(),
      },
      data,
    });
  }

  async findById(id: string): Promise<PharmaceuticalForm | null> {
    const pharmaceuticalForm = await this.prisma.pharmaceuticalForm.findUnique({
      where: {
        id,
      },
    });

    if (!pharmaceuticalForm) return null;

    return PrismaPharmaceuticalFormMapper.toDomain(pharmaceuticalForm);
  }

  async findByContent(content: string): Promise<PharmaceuticalForm | null> {
    const pharmaceuticalForm = await this.prisma.pharmaceuticalForm.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },
    });

    if (!pharmaceuticalForm) {
      return null;
    }

    return PrismaPharmaceuticalFormMapper.toDomain(pharmaceuticalForm);
  }

  async findMany(
    { page, perPage = 10 }: PaginationParams,
    content?: string,
  ): Promise<{
    pharmaceuticalForms: PharmaceuticalForm[];
    meta: Meta;
  }> {
    const whereClause: Prisma.PharmaceuticalFormWhereInput = {
      name: {
        contains: content ?? '',
        mode: 'insensitive',
      },
    };

    const [pharmaceuticalForms, totalCount] = await this.prisma.$transaction([
      this.prisma.pharmaceuticalForm.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      this.prisma.pharmaceuticalForm.count({
        where: whereClause,
      }),
    ]);

    const pharmaceuticalFormMappered = pharmaceuticalForms.map(
      PrismaPharmaceuticalFormMapper.toDomain,
    );

    return {
      pharmaceuticalForms: pharmaceuticalFormMappered,
      meta: {
        page,
        totalCount,
      },
    };
  }

  async delete(pharmaceuticalFormId: string): Promise<void> {
    await this.prisma.pharmaceuticalForm.delete({
      where: {
        id: pharmaceuticalFormId,
      },
    });
  }
}
