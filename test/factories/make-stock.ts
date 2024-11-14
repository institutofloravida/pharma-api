import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Stock, type StockProps } from '@/domain/pharma/enterprise/entities/stock'
import { PrismaStockMapper } from '@/infra/database/prisma/mappers/prisma-stock-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeStock(
  override: Partial<StockProps> = {},
  id?: UniqueEntityId,
) {
  const stock = Stock.create({
    content: faker.database.collation(),
    institutionId: new UniqueEntityId(),
    ...override,
  },
  id)

  return stock
}

@Injectable()
export class StockFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStock(data: Partial<StockProps> = {}): Promise<Stock> {
    const stock = makeStock(data)

    await this.prisma.stock.create({
      data: PrismaStockMapper.toPrisma(stock),
    })

    return stock
  }
}
