import { StockSettings } from '@/domain/pharma/enterprise/entities/stock-settings'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Prisma, StockSettings as PrismaStockSettings } from 'prisma/generated'

export class PrismaStockSettingsMapper {
  static toDomain(raw: PrismaStockSettings): StockSettings {
    return StockSettings.create(
      {
        stockId: new UniqueEntityId(raw.stockId),
        expirationWarningDays: raw.expirationWarningDays,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    settings: StockSettings,
  ): Prisma.StockSettingsUncheckedCreateInput {
    return {
      id: settings.id.toString(),
      stockId: settings.stockId.toString(),
      expirationWarningDays: settings.expirationWarningDays,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    }
  }
}
