import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaInstitutionMapper } from '../mappers/prisma-institution-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaInstitutionsRepository implements InstitutionsRepository {
  constructor(private prisma: PrismaService) {}

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
        name: content,
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

  async findMany({ page }: PaginationParams): Promise<Institution[]> {
    const institutions = await this.prisma.institution.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return institutions.map(PrismaInstitutionMapper.toDomain)
  }
}
