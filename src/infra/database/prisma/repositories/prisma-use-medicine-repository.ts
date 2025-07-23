import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UseMedicinesRepository } from '@/domain/pharma/application/repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/entities/use-medicine'
import { PrismaUseMedicineMapper } from '../mappers/prisma-use-medicine-maper'
import { MetaReport } from '@/core/repositories/meta'
import { Prisma } from 'prisma/generated'
import { UseMedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/use-medicine-details'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

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
    utilization: UseMedicineDetails[];
    totalUtilization: number;
    meta: MetaReport;
  }> {
    const { institutionId, month, year, stockId } = filters
    const useMedicinesWithTotalUsed = await this.prisma.$queryRaw<
  Array<{
    id: string;
    year: number;
    month: number;
    previousBalance: number;
    medicineStockId: string;
    currentBalance: number;
    used: number;
    totalUsed: number;
    medicine: string;
    dosage: string;
    unitMeasure: string;
    pharmaceuticalForm: string;
    complement?: string;
    createdAt: Date;
    updatedAt: Date | null;
  }>
>(
      Prisma.sql`
    SELECT 
     um.id,
  um.year,
  um.month,
  um.previous_balance AS "previousBalance",
  um.current_balance AS "currentBalance",
  um.medicine_stock_id AS "medicineStockId",
  um.created_at AS "createdAt",
  um.updated_at AS "updatedAt",
  mv.complement,
  mv.dosage,
  pf.name AS "pharmaceuticalForm",
  um2.acronym AS "unitMeasure",
  m.name AS "medicine",
      COALESCE(SUM(e.quantity), 0) AS "totalUsed"
    FROM 
      "use_medicine" um
    INNER JOIN "medicines_stocks" ms ON ms.id = um."medicine_stock_id"
    INNER JOIN "medicines_variants" mv ON mv.id = ms."medicine_variant_id"
    INNER JOIN "medicines" m ON m.id = mv."medicine_id"
    INNER JOIN "pharmaceutical_forms" pf ON pf.id = mv."pharmaceutical_form_id"
    INNER JOIN "unit_measures" um2 ON um2.id = mv."unit_measure_id"
    INNER JOIN "stocks" s ON s.id = ms."stock_id"
    LEFT JOIN "exits" e 
      ON e."medicine_stock_id" = um."medicine_stock_id"
      AND EXTRACT(YEAR FROM e."exit_date") = ${year}
      AND EXTRACT(MONTH FROM e."exit_date") = ${month + 1}
    WHERE 
      s."institution_id" = ${institutionId}
      ${stockId
? Prisma.sql`AND s.id = ${stockId}`
: Prisma.empty}
      AND um.year = ${year}
      AND um.month = ${month}
    GROUP BY 
      um.id, mv."complement", mv."dosage", pf."name", um2."acronym", m."name"
  `,
    )

    const [totalGeneralResult] = await this.prisma.$queryRaw<
      Array<{ totalGeneralUsed: bigint }>
    >(
      Prisma.sql`
    SELECT 
      COALESCE(SUM(e.quantity), 0) AS "totalGeneralUsed"
    FROM "exits" e
    INNER JOIN "medicines_stocks" ms ON ms.id = e."medicine_stock_id"
    INNER JOIN "stocks" s ON s.id = ms."stock_id"
    WHERE 
      s."institution_id" = ${institutionId}
      ${stockId
? Prisma.sql`AND s.id = ${stockId}`
: Prisma.sql``}
      AND EXTRACT(YEAR FROM e."exit_date") = ${year}
      AND EXTRACT(MONTH FROM e."exit_date") = ${month + 1}
  `,
    )

    const utilization = useMedicinesWithTotalUsed.map((useMedicine) => {
      return UseMedicineDetails.create({
        dosage: useMedicine.dosage,
        unitMeasure: useMedicine.unitMeasure,
        complement: useMedicine.complement,
        createdAt: useMedicine.createdAt,
        currentBalance: useMedicine.currentBalance,
        id: new UniqueEntityId(useMedicine.id),
        medicine: useMedicine.medicine,
        medicineStockId: new UniqueEntityId(useMedicine.medicineStockId),
        month: useMedicine.month,
        pharmaceuticalForm: useMedicine.pharmaceuticalForm,
        previousBalance: useMedicine.previousBalance,
        updatedAt: useMedicine.updatedAt,
        year: useMedicine.year,
        used: Number(useMedicine.totalUsed),
      })
    })
    return {
      meta: {
        totalCount: utilization.length,
      },
      totalUtilization: Number(totalGeneralResult.totalGeneralUsed),
      utilization,
    }
  }
}
