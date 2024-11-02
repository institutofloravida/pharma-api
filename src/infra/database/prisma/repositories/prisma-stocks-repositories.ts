import { StocksRepository } from '@/domain/pharma/application/repositories/stocks-repository'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { PrismaService } from '../prisma.service'
import { PrismaStockMapper } from '../mappers/prisma-stock-mapper'
import { Injectable } from '@nestjs/common'

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
}
