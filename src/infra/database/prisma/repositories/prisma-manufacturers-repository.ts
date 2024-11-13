import { PaginationParams } from '@/core/repositories/pagination-params'
import { ManufacturersRepository } from '@/domain/pharma/application/repositories/manufacturers-repository'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaManufacturerMapper } from '../mappers/prisma-manufacturer-mapper'

@Injectable()
export class PrismaManufacturersRepository implements ManufacturersRepository {
  constructor(private prisma: PrismaService) {
  }

  async create(manufacturer: Manufacturer) {
    const data = PrismaManufacturerMapper.toPrisma(manufacturer)
    await this.prisma.manufacturer.create({
      data,
    })
  }

  async findByContent(content: string) {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        name: {
          equals: content.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!manufacturer) {
      return null
    }

    return PrismaManufacturerMapper.toDomain(manufacturer)
  }

  async findByCnpj(cnpj: string) {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        cnpj: {
          equals: cnpj.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!manufacturer) {
      return null
    }

    return PrismaManufacturerMapper.toDomain(manufacturer)
  }

  async findMany({ page }: PaginationParams): Promise<Manufacturer[]> {
    const manufacturers = await this.prisma.manufacturer.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return manufacturers.map(PrismaManufacturerMapper.toDomain)
  }
}
