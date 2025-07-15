import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'
import { PrismaUseMedicineMapper } from '../mappers/prisma-use-medicine-maper'
import { MetaReport } from '@/core/repositories/meta'

@Injectable()
export class PrismaUseMedicinesRepository implements UseMedicinesRepository {
  constructor(private prisma: PrismaService) {}

  async create(useMedicine: UseMedicine): Promise<void> {
    const data = PrismaUseMedicineMapper.toPrisma(useMedicine)
    await this.prisma.useMedicine.create({
      data,
    })
  }

  async save(useMedicine: UseMedicine): Promise<void> {
    const data = PrismaUseMedicineMapper.toPrisma(useMedicine)

    await this.prisma.useMedicine.update({
      where: {
        id: useMedicine.id.toString(),
      },
      data,
    })
  }

  async findByMedicineStockIdAndYearAndMonth(
    year: number,
    month: number,
    medicineStockId: string,
  ): Promise<UseMedicine | null> {
    const useMedicine = await this.prisma.useMedicine.findUnique({
      where: {
        year_month_medicineStockId: {
          medicineStockId,
          month,
          year,
        },
      },
    })

    if (!useMedicine) {
      return null
    }

    return PrismaUseMedicineMapper.toDomain(useMedicine)
  }

  async fetchMonthlyMedicinesUtilization(filters: {
    institutionId: string;
    year: number;
    month: number;
    stockId?: string;
  }): Promise<{
    utilization: UseMedicine[];
    totalUtilization: number;
    meta: MetaReport;
  }> {
    const { institutionId, month, year, stockId } = filters

    const useMedicinesWithTotalUsed = await this.prisma.$queryRawUnsafe<
      Array<{
        id: string;
        year: number;
        month: number;
        previousBalance: number;
        medicineStockId: string;
        currentBalance: number;
        used: number;
        createdAt: Date;
        updatedAt: Date | null;
        totalUsed: number;
      }>
    >(`
  SELECT 
    um.*,
    COALESCE(SUM(e.quantity), 0) AS "totalUsed"
  FROM 
    "use_medicine" um
  INNER JOIN "medicines_stocks" ms ON ms.id = um."medicine_stock_id"
  INNER JOIN "stocks" s ON s.id = ms."stock_id"
  LEFT JOIN "exits" e 
    ON e."medicine_stock_id" = um."medicine_stock_id"
    AND EXTRACT(YEAR FROM e."exitDate") = um.year
    AND EXTRACT(MONTH FROM e."exitDate") = um.month + 1

  WHERE 
    s."institution_id" = '${institutionId}'
    ${stockId
? `AND s.id = '${stockId}'`
: ''}
    AND um.year = ${year}
    AND um.month = ${month}
  GROUP BY 
    um.id
`)

    const [totalGeneralResult] = await this.prisma.$queryRawUnsafe<
      Array<{
        totalGeneralUsed: number;
      }>
    >(`
  SELECT 
    COALESCE(SUM(e.quantity), 0) AS "totalGeneralUsed"
  FROM "exits" e
  INNER JOIN "medicines_stocks" ms ON ms.id = e."medicine_stock_id"
  INNER JOIN "stocks" s ON s.id = ms."stock_id"
  WHERE 
    s."institution_id" = '${institutionId}'
    ${stockId
? `AND s.id = '${stockId}'`
: ''}
    AND EXTRACT(YEAR FROM e."exitDate") = ${year}
    AND EXTRACT(MONTH FROM e."exitDate") = um.month + 1

`)

    const utilization = useMedicinesWithTotalUsed.map(useMedicine => {
      return PrismaUseMedicineMapper.toDomain({
        ...useMedicine,
        used: useMedicine.totalUsed,
      })
    })

    return {
      meta: {
        totalCount: utilization.length,
      },
      totalUtilization: totalGeneralResult.totalGeneralUsed,
      utilization,
    }
  }
}
