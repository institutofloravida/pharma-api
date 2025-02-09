import { PaginationParams } from '@/core/repositories/pagination-params'
import { ManufacturersRepository } from '@/domain/pharma/application/repositories/manufacturers-repository'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaManufacturerMapper } from '../mappers/prisma-manufacturer-mapper'
import { Meta } from '@/core/repositories/meta'

@Injectable()
export class PrismaManufacturersRepository implements ManufacturersRepository {
  constructor(private prisma: PrismaService) {}

  async create(manufacturer: Manufacturer) {
    const data = PrismaManufacturerMapper.toPrisma(manufacturer)
    await this.prisma.manufacturer.create({
      data,
    })
  }

  async save(manufacturer: Manufacturer): Promise<void> {
    const data = PrismaManufacturerMapper.toPrisma(manufacturer)

    await this.prisma.manufacturer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findById(manufacturerId: string): Promise<Manufacturer | null> {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        id: manufacturerId,
      },
    })

    if (!manufacturer) {
      return null
    }

    return PrismaManufacturerMapper.toDomain(manufacturer)
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

  async findMany(
    { page }: PaginationParams,
    content?: string,
    cnpj?: string,
  ): Promise<{ manufacturers: Manufacturer[]; meta: Meta }> {
    const [manufacturers, manufacturesTotalCount] = await Promise.all([
      await this.prisma.manufacturer.findMany({
        where: {
          name: {
            contains: content ?? '',
            mode: 'insensitive',
          },
          cnpj: {
            contains: cnpj ?? '',
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * 10,
        take: 10,
      }),
      await this.prisma.manufacturer.count({
        where: {
          name: {
            contains: content ?? '',
            mode: 'insensitive',
          },
          cnpj: {
            contains: cnpj ?? '',
          },
        },
      }),
    ])

    const manufacturersMapped = manufacturers.map(PrismaManufacturerMapper.toDomain)
    return {
      manufacturers: manufacturersMapped,
      meta: {
        page,
        totalCount: manufacturesTotalCount,
      },
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.manufacturer.delete({
      where: {
        id,
      },
    })
  }
}
