import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository';
import {
  Dispensation,
  type DispensationPerDay,
} from '@/domain/pharma/enterprise/entities/dispensation';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaDispensationMapper } from '../mappers/prisma-dispensation-mapper';
import { Meta, type MetaReport } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient';
import { $Enums, Prisma } from 'prisma/generated';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MostTreatedPathology } from '@/domain/pharma/enterprise/entities/pathology';
import { DispensationWithMedicines } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-medicines';

@Injectable()
export class PrismaDispensationsMedicinesRepository
  implements DispensationsMedicinesRepository
{
  constructor(private prisma: PrismaService) {}

  async create(dispensation: Dispensation): Promise<void> {
    const data = PrismaDispensationMapper.toPrisma(dispensation);
    await this.prisma.dispensation.create({
      data,
    });
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      patientId?: string;
      dispensationDate?: Date;
      operatorId?: string;
    },
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: Meta }> {
    const { patientId, dispensationDate, operatorId } = filters;

    const whereClause: Prisma.DispensationWhereInput = {
      ...(patientId && { patientId: { equals: patientId } }),
      ...(operatorId && { operatorId: { equals: operatorId } }),
      ...(dispensationDate && {
        dispensationDate: {
          gte: new Date(dispensationDate.setHours(0, 0, 0, 0)), // Início do dia
          lte: new Date(dispensationDate.setHours(23, 59, 59, 999)), // Fim do dia
        },
      }),
    };

    const [dispensations, totalCount] = await this.prisma.$transaction([
      this.prisma.dispensation.findMany({
        where: whereClause,
        take: 10,
        skip: (Math.max(1, page) - 1) * 10,
        include: {
          exit: {
            select: {
              id: true,
              reverseAt: true,
              _count: {
                select: {
                  movimentation: true,
                },
              },
            },
          },
          operator: { select: { id: true, name: true } },
          patient: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dispensation.count({ where: whereClause }),
    ]);

    const dispensationsMapped = dispensations.map((dispensation) => {
      return DispensationWithPatient.create({
        dispensationDate: dispensation.dispensationDate,
        dispensationId: new UniqueEntityId(dispensation.id),
        operator: dispensation.operator.name,
        operatorId: new UniqueEntityId(dispensation.operator.id),
        patientId: new UniqueEntityId(dispensation.patient.id),
        patient: dispensation.patient.name,
        items: dispensation.exit?._count.movimentation ?? 0,
        exitId: new UniqueEntityId(dispensation.exit?.id),
        reversedAt: dispensation.exit?.reverseAt,
      });
    });

    return {
      dispensations: dispensationsMapped,
      meta: {
        page,
        totalCount,
      },
    };
  }

  async getDispensationMetrics(institutionId: string): Promise<{
    today: { total: number; percentageAboveAverage: number };
    month: { total: number; percentageComparedToLastMonth: number };
  }> {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const [todayCount, monthCount, lastMonthCount] =
      await this.prisma.$transaction([
        this.prisma.dispensation.count({
          where: {
            exit: {
              reverseAt: null,
              stock: {
                institution: {
                  id: {
                    equals: institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
        this.prisma.dispensation.count({
          where: {
            exit: {
              reverseAt: null,
              stock: {
                institution: {
                  id: {
                    equals: institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: startOfMonth,
            },
          },
        }),
        this.prisma.dispensation.count({
          where: {
            exit: {
              reverseAt: null,
              stock: {
                institution: {
                  id: {
                    equals: institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
              lt: new Date(new Date().setMonth(new Date().getMonth(), 1)),
            },
          },
        }),
      ]);

    const averageLastMonth = lastMonthCount > 0 ? lastMonthCount / 30 : 0;

    return {
      today: {
        total: todayCount,
        percentageAboveAverage:
          averageLastMonth > 0
            ? ((todayCount - averageLastMonth) / averageLastMonth) * 100
            : 0,
      },
      month: {
        total: monthCount,
        percentageComparedToLastMonth:
          lastMonthCount > 0
            ? ((monthCount - lastMonthCount) / lastMonthCount) * 100
            : 0,
      },
    };
  }

  async getDispensationsInAPeriod(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
    patientId?: string,
    operatorId?: string,
  ): Promise<{ dispensations: DispensationWithMedicines[]; meta: MetaReport }> {
    const whereClauses: string[] = ["e.exit_type = 'DISPENSATION'"];
    const params: any[] = [];
    let paramIndex = 1;

    if (institutionId) {
      whereClauses.push(`i.id = $${paramIndex++}`);
      params.push(institutionId);
    }
    if (startDate) {
      whereClauses.push(`d.dispensation_date >= $${paramIndex++}`);
      params.push(new Date(startDate.setHours(0, 0, 0, 0)));
    }
    if (endDate) {
      whereClauses.push(`d.dispensation_date <= $${paramIndex++}`);
      params.push(new Date(endDate.setHours(23, 59, 59, 999)));
    }
    if (patientId) {
      whereClauses.push(`p.id = $${paramIndex++}`);
      params.push(patientId);
    }
    if (operatorId) {
      whereClauses.push(`o.id = $${paramIndex++}`);
      params.push(operatorId);
    }

    const whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const dispensations = await this.prisma.$queryRawUnsafe<any[]>(
      `
    SELECT
      d.id as "dispensationId",
      d.dispensation_date as "dispensationDate",
      o.id as "operatorId",
      o.name as "operatorName",
      p.id as "patientId",
      p.name as "patientName",
      e.id as "exitId",
      e.exit_date as "exitDate",
      s.name as "stockName",
      COUNT(DISTINCT meds."medicineStockId") as "items",
      COALESCE(json_agg(
        json_build_object(
          'medicineStockId', meds."medicineStockId",
          'medicine', meds.medicine,
          'pharmaceuticalForm', meds."pharmaceuticalForm",
          'unitMeasure', meds."unitMeasure",
          'complement', meds.complement,
          'quantity', meds.quantity,
          'dosage', meds.dosage
        )
      ) FILTER (WHERE meds."medicineStockId" IS NOT NULL), '[]') as medicines
    FROM dispensations d
    INNER JOIN "exits" e ON e.dispensation_id = d.id AND e.reverse_at IS NULL
    INNER JOIN operators o ON o.id = e.operator_id
    INNER JOIN patients p ON p.id = d.patient_id
    INNER JOIN stocks s ON s.id = e.stock_id
    INNER JOIN institutions i ON i.id = s.institution_id
    LEFT JOIN LATERAL (
      SELECT
        bs.medicine_stock_id AS "medicineStockId",
        m2.name AS medicine,
        pf.name AS "pharmaceuticalForm",
        um.acronym AS "unitMeasure",
        mv.dosage AS "dosage",
        mv.complement AS complement,
        SUM(mtn.quantity) AS quantity
      FROM movimentation mtn
      INNER JOIN batches_stocks bs ON bs.id = mtn.batch_stock_id
      INNER JOIN medicines_stocks ms ON ms.id = bs.medicine_stock_id
      INNER JOIN medicines_variants mv ON mv.id = ms.medicine_variant_id
      INNER JOIN medicines m2 ON m2.id = mv.medicine_id
      INNER JOIN pharmaceutical_forms pf ON pf.id = mv.pharmaceutical_form_id
      INNER JOIN unit_measures um ON um.id = mv.unit_measure_id
      WHERE mtn.exit_id = e.id
      GROUP BY bs.medicine_stock_id, m2.name, pf.name, um.name, mv.complement, um.acronym, mv.dosage
    ) meds ON TRUE
    ${whereSQL}
    GROUP BY d.id, d.dispensation_date, o.id, o.name, p.id, p.name, e.id, e.exit_date, s.name
    ORDER BY d.dispensation_date DESC
    `,
      ...params,
    );

    const dispensationsMapped: DispensationWithMedicines[] = dispensations.map(
      (row) =>
        DispensationWithMedicines.create({
          dispensationDate: row.dispensationDate,
          dispensationId: new UniqueEntityId(row.dispensationId),
          operator: row.operatorName,
          operatorId: new UniqueEntityId(row.operatorId),
          patientId: new UniqueEntityId(row.patientId),
          patient: row.patientName,
          items: Number(row.items),
          medicines: (row.medicines as any[]).map((med) => ({
            medicineStockId: new UniqueEntityId(med.medicineStockId),
            medicine: med.medicine,
            pharmaceuticalForm: med.pharmaceuticalForm,
            unitMeasure: med.unitMeasure,
            complement: med.complement,
            dosage: med.dosage,
            quantity: med.quantity,
          })),
        }),
    );

    return {
      dispensations: dispensationsMapped,
      meta: {
        totalCount: dispensations.length,
      },
    };
  }

  async fetchDispensesPerDay(
    institutionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ dispenses: DispensationPerDay[]; meta: MetaReport }> {
    const dispensesGroupedByDay = await this.prisma.$queryRawUnsafe<
      Array<{ dispensationDate: Date; total: number }>
    >(
      `
    SELECT
      DATE(d."dispensation_date") AS "dispensationDate",
      COUNT(*) AS total
    FROM "dispensations" d
    INNER JOIN "exits" e ON e."dispensation_id" = d.id AND e.reverse_at IS NULL
    INNER JOIN "stocks" s ON s.id = e."stock_id"
    WHERE s."institution_id" = $1
      AND d."dispensation_date" >= $2
      AND d."dispensation_date" <= $3
    GROUP BY DATE(d."dispensation_date")
    ORDER BY DATE(d."dispensation_date") ASC
    `,
      institutionId,
      startDate,
      endDate,
    );

    const totalCount = dispensesGroupedByDay.reduce(
      (acc, curr) => acc + Number(curr.total),
      0,
    );

    const dispensesPerDay: DispensationPerDay[] = dispensesGroupedByDay.map(
      (group) => ({
        dispensationDate:
          group.dispensationDate instanceof Date
            ? group.dispensationDate.toISOString().split('T')[0]
            : group.dispensationDate,
        total: Number(group.total),
      }),
    );

    return {
      dispenses: dispensesPerDay,
      meta: {
        totalCount,
      },
    };
  }

  async fetchMostTreatedPathologies(
    institutionId?: string,
  ): Promise<{ mostTreatedPathologies: MostTreatedPathology[] }> {
    const whereClause = institutionId
      ? `WHERE s."institution_id" = '${institutionId}'`
      : '';
    const pathologies = await this.prisma.$queryRawUnsafe<
      Array<{ pathologyId: string; pathologyName: string; total: number }>
    >(
      `SELECT
        p.id AS "pathologyId",
        p.name AS "pathologyName",
        COUNT(DISTINCT d.id) AS total
      FROM "pathology" p
      INNER JOIN "_PathologyToPatient" pp ON pp."A" = p.id
      INNER JOIN "patients" pa ON pa.id = pp."B"
      INNER JOIN "dispensations" d ON d."patient_id" = pa.id
      INNER JOIN "exits" e ON e."dispensation_id" = d.id AND e.reverse_at IS NULL
      INNER JOIN "movimentation" m ON m."exit_id" = e.id
      INNER JOIN "batches_stocks" bs ON bs.id = m."batch_stock_id"
      INNER JOIN "stocks" s ON s.id = bs."stock_id"
      ${whereClause}
      GROUP BY p.id, p.name
      ORDER BY total DESC`,
    );

    const totalDispensations = pathologies.reduce(
      (sum, p) => sum + Number(p.total),
      0,
    );
    const top4 = pathologies.slice(0, 4).map((p) => ({
      ...p,
      total: Number(p.total),
      percentage:
        totalDispensations > 0
          ? (Number(p.total) / totalDispensations) * 100
          : 0,
    }));
    const othersTotal = pathologies
      .slice(4)
      .reduce((sum, p) => sum + Number(p.total), 0);
    const othersPercentage =
      totalDispensations > 0 ? (othersTotal / totalDispensations) * 100 : 0;

    const result: MostTreatedPathology[] = [...top4];
    if (othersTotal > 0) {
      result.push({
        pathologyId: 'others',
        pathologyName: 'Outros',
        total: othersTotal,
        percentage: othersPercentage,
      });
    }

    return { mostTreatedPathologies: result };
  }
}
