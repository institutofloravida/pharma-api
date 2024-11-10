import { StocksRepository, type StockWithInstitution } from '@/domain/pharma/application/repositories/stocks-repository'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { PrismaService } from '../prisma.service'
import { PrismaStockMapper } from '../mappers/prisma-stock-mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaStocksRepository implements StocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(stock: Stock): Promise<void> {
    const data = PrismaStockMapper.toPrisma(stock)
    await this.prisma.stock.create({
      data,
    })
  }

  async findByContent(content: string, institutionId: string): Promise<Stock | null> {
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
    })

    if (!stock) {
      return null
    }

    return PrismaStockMapper.toDomain(stock)
  }

  async findManyByInstitutionsId({ page }: PaginationParams, institutionsIds: string[]): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany({
      where: {
        institutionId: {
          in: institutionsIds,
        },
      },
      include: {
        Institution: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return stocks.map(PrismaStockMapper.toDomain)
  }

  async findManyWithInstitution({ page }: PaginationParams, institutionsIds: string[], isSuper?: boolean): Promise<StockWithInstitution[]> {
    const stocks = await this.prisma.stock.findMany({
      where: !isSuper
        ? { institutionId: { in: institutionsIds } }
        : undefined,
      include: {
        Institution: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    console.log(stocks.length)
    return stocks.map((stock) => ({
      stock: PrismaStockMapper.toDomain(stock),
      institutionName: stock.Institution?.name ?? '',
    }))
  }
}
