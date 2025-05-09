import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { Stock as PrismaStock, type Prisma } from 'prisma/generated/prisma'

export class PrismaStockMapper {
  static toDomain(raw: PrismaStock): Stock {
    return Stock.create({
      content: raw.name,
      institutionId: new UniqueEntityId(raw.institutionId),
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(stock: Stock): Prisma.StockUncheckedCreateInput {
    return {
      id: stock.id.toString(),
      name: stock.content,
      institutionId: stock.institutionId.toString(),
      status: stock.status,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }
  }
}
