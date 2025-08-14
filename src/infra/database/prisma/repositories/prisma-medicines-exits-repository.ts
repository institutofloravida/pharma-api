import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository';
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit';
import { PrismaMedicineExitMapper } from '../mappers/prisma-medicine-exit-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details';
import { PrismaExitDetailsMapper } from '../mappers/prisma-exit-details-mapper';

@Injectable()
export class PrismaMedicinesExitsRepository
  implements MedicinesExitsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(medicineExit: MedicineExit): Promise<void> {
    const data = PrismaMedicineExitMapper.toPrisma(medicineExit);
    await this.prisma.exit.create({
      data,
    });
  }

  async findById(id: string): Promise<MedicineExit | null> {
    const exit = await this.prisma.exit.findUnique({
      where: {
        id,
      },
    });
    if (!exit) {
      return null;
    }

    return PrismaMedicineExitMapper.toDomain(exit);
  }

  async findByIdWithDetails(id: string): Promise<ExitDetails | null> {
    const exit = await this.prisma.exit.findUnique({
      where: { id },
      include: {
        operator: {
          select: { name: true },
        },
        destinationInstitution: {
          select: {
            name: true,
            responsible: true,
          },
        },
        stock: {
          select: { name: true },
        },
      },
    });
    if (!exit) return null;

    const items = await this.prisma.medicineStock.findMany({
      distinct: ['id'],
      where: {
        batchesStocks: {
          some: {
            movimentation: {
              some: {
                exitId: exit.id,
              },
            },
          },
        },
      },
    });

    return PrismaExitDetailsMapper.toDomain({
      ...exit,
      destinationInstitution: exit.destinationInstitution?.name,
      responsibleByInstitution: exit.destinationInstitution?.responsible,
      exitType: exit.exitType,
      items: items.length,
      operator: exit.operator.name,
      stock: exit.stock.name,
    });
  }

  async findByTransferId(transferId: string): Promise<MedicineExit | null> {
    const exit = await this.prisma.exit.findUnique({
      where: { transferId },
    });
    if (!exit) return null;

    return PrismaMedicineExitMapper.toDomain(exit);
  }

  async save(medicineExit: MedicineExit): Promise<void> {
    const data = PrismaMedicineExitMapper.toPrisma(medicineExit);

    await this.prisma.exit.update({
      where: { id: medicineExit.id.toString() },
      data,
    });
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }> {
    const { exitDate, exitType, institutionId, operatorId } = filters;

    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (institutionId) {
      whereClauses.push(`s.institution_id = $${paramIndex++}`);
      params.push(institutionId);
    }
    if (operatorId) {
      whereClauses.push(`e.operator_id = $${paramIndex++}`);
      params.push(operatorId);
    }
    if (exitType) {
      whereClauses.push(`e.exit_type = $${paramIndex++}`);
      params.push(exitType);
    }
    if (exitDate) {
      whereClauses.push(`e.exit_date::date = $${paramIndex++}::date`);
      params.push(exitDate);
    }

    const whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const exits = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        exitDate: Date;
        operatorName: string;
        stockName: string;
        stockId: string;
        destinationInstitution?: string;
        exitType: ExitType;
        items: number;
        reverseAt?: Date | null;
      }[]
    >(
      `
    select 
      e.id as "id",
      e.exit_type as "exitType",
      e.exit_date as "exitDate",
      o."name" as "operatorName",
      s."name" as "stockName",
      s."id" as "stockId",
      e.reverse_at as "reverseAt",
     i."name" as "destinationInstitution",
      COUNT(distinct bs.medicine_stock_id) as "items"
    from movimentation m
    inner join "exits" e on e.id = m.exit_id
    inner join batches_stocks bs on bs.id = m.batch_stock_id
    inner join operators o on o.id = e.operator_id
    inner join stocks s on s.id = e.stock_id
    left join institutions i on i.id = e.destination_institution_id
    ${whereSQL}
group by e.id, o."name", s."name", i."name", s."id"
    order by e.exit_date desc
    limit 10 offset ${(page - 1) * 10}
  `,
      ...params,
    );

    // Para totalCount, faz uma query separada
    const totalCountResult = await this.prisma.$queryRawUnsafe<
      { count: number }[]
    >(
      `
    select count(*)::int as count
    from (
      select e.id
      from movimentation m
      inner join "exits" e on e.id = m.exit_id
      inner join batches_stocks bs on bs.id = m.batch_stock_id
      inner join operators o on o.id = e.operator_id
      inner join stocks s on s.id = e.stock_id
      ${whereSQL}
      group by e.id, o."name", s."name"
    ) as sub
  `,
      ...params,
    );
    const totalCount = totalCountResult[0]?.count || 0;

    const medicinesExitsMapped = exits.map((exit) => {
      return ExitDetails.create({
        exitDate: exit.exitDate,
        operator: exit.operatorName,
        stock: exit.stockName,
        stockId: new UniqueEntityId(exit.stockId),
        destinationInstitution: exit.destinationInstitution,
        exitType: exit.exitType,
        reverseAt: exit.reverseAt ?? null,
        exitId: new UniqueEntityId(exit.id),
        items: Number(exit.items),
      });
    });
    return {
      medicinesExits: medicinesExitsMapped,
      meta: {
        page,
        totalCount,
      },
    };
  }
}
