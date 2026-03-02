import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { StockSettingsRepository } from '@/domain/pharma/application/repositories/stock-settings-repository'
import { StockSettings } from '@/domain/pharma/enterprise/entities/stock-settings'
import { PrismaStockSettingsMapper } from '../mappers/prisma-stock-settings-mapper'

@Injectable()
export class PrismaStockSettingsRepository implements StockSettingsRepository {
  constructor(private prisma: PrismaService) {}

  async findByStockId(stockId: string): Promise<StockSettings | null> {
    const settings = await this.prisma.stockSettings.findUnique({
      where: { stockId },
    })

    if (!settings) {
      return null
    }

    return PrismaStockSettingsMapper.toDomain(settings)
  }

  async upsert(settings: StockSettings): Promise<void> {
    const data = PrismaStockSettingsMapper.toPrisma(settings)

    await this.prisma.stockSettings.upsert({
      where: { stockId: settings.stockId.toString() },
      create: data,
      update: {
        expirationWarningDays: settings.expirationWarningDays,
        updatedAt: settings.updatedAt,
      },
    })
  }
}
