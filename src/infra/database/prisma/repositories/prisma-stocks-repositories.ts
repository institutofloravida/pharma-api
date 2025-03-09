import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { StocksRepository } from '@/domain/pharma/application/repositories/stocks-repository'
import { StockWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/stock-with-institution'
import { Injectable } from '@nestjs/common'
import { PrismaStockMapper } from '../mappers/prisma-stock-mapper'
import { PrismaService } from '../prisma.service'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'

@Injectable()
export class PrismaStocksRepository implements StocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(stock: Stock): Promise<void> {
    const data = PrismaStockMapper.toPrisma(stock)
    await this.prisma.stock.create({
      data,
    })
  }

  async save(stock: Stock): Promise<void> {
    const data = PrismaStockMapper.toPrisma(stock)

    await this.prisma.stock.update({
      where: {
        id: stock.id.toString(),
      },
      data,
    })
  }

  async findByContent(
    content: string,
    institutionId: string,
  ): Promise<Stock | null> {
    const stock = await this.prisma.stock.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
        institutionId,
      },
    })

    if (!stock) {
      return null
    }

    return PrismaStockMapper.toDomain(stock)
  }

  async findById(id: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        id,
      },
      include: {
        institution: true,
      },
    })

    if (!stock) {
      return null
    }

    const stockMapped = PrismaStockMapper.toDomain(stock)

    return stockMapped
  }

  async findByIdWithDetails(id: string): Promise<StockWithInstitution | null> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        id,
      },
      include: {
        institution: true,
      },
    })

    if (!stock) {
      return null
    }

    const stockMapped = PrismaStockMapper.toDomain(stock)

    return StockWithInstitution.create({
      id: stockMapped.id,
      content: stockMapped.content,
      status: stockMapped.status,
      institutionId: stockMapped.institutionId,
      institutionName: stock.institution?.name ?? '',
      createdAt: stockMapped.createdAt,
      updatedAt: stockMapped.updatedAt,
    })
  }

  async findManyByInstitutionsId(
    { page }: PaginationParams,
    institutionsIds: string[],
  ): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany({
      where: {
        institutionId: {
          in: institutionsIds,
        },
      },
      include: {
        institution: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })
    return stocks.map(PrismaStockMapper.toDomain)
  }

  async findManyWithInstitution(
    { page }: PaginationParams,
    institutionsIds: string[],
    content?: string,
    isSuper?: boolean,
  ): Promise<{ stocks: StockWithInstitution[]; meta: Meta }> {
    const [stocks, stocksTotalCount] = await Promise.all([
      this.prisma.stock.findMany({
        where: {
          ...(!isSuper && { institutionId: { in: institutionsIds } }),
          name: {
            contains: content ?? '',
            mode: 'insensitive',
          },
        },
        include: {
          institution: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.stock.count({
        where: {
          ...(!isSuper && { institutionId: { in: institutionsIds } }),

          name: { contains: content ?? '', mode: 'insensitive' },
        },
      }),
    ])

    const stocksMapped = stocks.map((stock) => {
      const stockMapped = PrismaStockMapper.toDomain(stock)

      return StockWithInstitution.create({
        id: stockMapped.id,
        content: stockMapped.content,
        status: stockMapped.status,
        institutionId: stockMapped.institutionId,
        institutionName: stock.institution?.name ?? '',
        createdAt: stockMapped.createdAt,
        updatedAt: stockMapped.updatedAt,
      })
    })
    return {
      stocks: stocksMapped,
      meta: {
        page,
        totalCount: stocksTotalCount,
      },
    }
  }
}
