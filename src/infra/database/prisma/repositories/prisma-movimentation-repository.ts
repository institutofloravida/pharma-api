import { type Meta } from '@/core/repositories/meta';
import { MovimentationRepository } from '@/domain/pharma/application/repositories/movimentation-repository';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { MovementDirection } from '@/domain/pharma/enterprise/entities/movement-type';
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation';
import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details';
import { Injectable } from '@nestjs/common';
import { PrismaMovimentationMapper } from '../mappers/prisma-movimentation-mapper';
import { PrismaService } from '../prisma.service';
import { $Enums, type Prisma } from 'prisma/generated';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';

@Injectable()
export class PrismaMovimentationRepository implements MovimentationRepository {
  constructor(private prisma: PrismaService) {}

  async create(movimentation: Movimentation): Promise<void> {
    const data = PrismaMovimentationMapper.toPrisma(movimentation);
    await this.prisma.movimentation.create({
      data,
    });
  }

  async fetchCorrectionDeltas(
    originalEntryId: string,
  ): Promise<Map<string, number>> {
    const [entryCorrections, exitCorrections] = await this.prisma.$transaction([
      // Movimentações de ENTRADA criadas por correções da entrada original
      this.prisma.movimentation.findMany({
        where: {
          direction: 'ENTRY',
          entry: { correctionOfEntryId: originalEntryId },
        },
        select: { batchStockId: true, quantity: true },
      }),
      // Movimentações de SAÍDA criadas por correções da entrada original
      this.prisma.movimentation.findMany({
        where: {
          direction: 'EXIT',
          correctionEntry: { correctionOfEntryId: originalEntryId },
        },
        select: { batchStockId: true, quantity: true },
      }),
    ]);

    const deltaMap = new Map<string, number>();
    for (const mov of entryCorrections) {
      deltaMap.set(
        mov.batchStockId,
        (deltaMap.get(mov.batchStockId) ?? 0) + mov.quantity,
      );
    }
    for (const mov of exitCorrections) {
      deltaMap.set(
        mov.batchStockId,
        (deltaMap.get(mov.batchStockId) ?? 0) - mov.quantity,
      );
    }
    return deltaMap;
  }

  async fetchMovimentation(
    filters: {
      institutionId?: string;
      startDate?: Date;
      endDate?: Date;
      operatorId?: string;
      medicineId?: string;
      stockId?: string;
      medicineVariantId?: string;
      medicineStockId?: string;
      batcheStockId?: string;
      quantity?: number;
      movementTypeId?: string;
      direction?: MovementDirection;
      exitId?: string;
      entryId?: string;
      exitType?: ExitType;
    },
    params: PaginationParams,
  ): Promise<{ movimentation: MovimentationDetails[]; meta: Meta }> {
    const {
      endDate,
      institutionId,
      startDate,
      batcheStockId,
      direction,
      exitType,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      operatorId,
      quantity,
      stockId,
      entryId,
      exitId,
    } = filters;

    const whereClause: Prisma.MovimentationWhereInput = {
      ...(exitId && {
        exitId: { equals: exitId },
      }),
      ...(entryId && {
        entryId: { equals: entryId },
      }),
      ...(direction && {
        direction: {
          equals: direction,
        },
      }),
      ...(quantity && {
        quantity: { gte: Number(quantity), lte: Number(quantity) },
      }),
      batchStock: {
        ...(stockId && { stockId: { equals: stockId } }),
        ...(batcheStockId && {
          id: {
            equals: batcheStockId,
          },
        }),
        ...(medicineId && {
          medicineStock: {
            ...(medicineStockId && {
              id: { equals: medicineStockId },
            }),
            medicineVariant: {
              medicineId: { equals: medicineId },
              ...(medicineVariantId && {
                id: { equals: medicineVariantId },
              }),
            },
          },
        }),
        ...(institutionId && {
          stock: {
            institutionId: { equals: institutionId },
          },
        }),
      },
      ...(direction === 'EXIT'
        ? {
            exit: {
              ...((startDate || endDate) && {
                exitDate: {
                  ...(startDate && { gte: new Date(startDate.setHours(0, 0, 0, 0)) }),
                  ...(endDate && { lte: new Date(endDate.setHours(23, 59, 59, 999)) }),
                },
              }),
              ...(exitType && {
                exitType: { equals: $Enums.ExitType[exitType] },
              }),
            },
          }
        : direction === 'ENTRY'
          ? {
              ...((startDate || endDate) && {
                entry: {
                  entryDate: {
                    ...(startDate && { gte: new Date(startDate.setHours(0, 0, 0, 0)) }),
                    ...(endDate && { lte: new Date(endDate.setHours(23, 59, 59, 999)) }),
                  },
                },
              }),
            }
          : {}),
      AND: [
        ...(movementTypeId
          ? [
              {
                OR: [
                  { entry: { movementTypeId: { equals: movementTypeId } } },
                  { exit: { movementTypeId: { equals: movementTypeId } } },
                ],
              },
            ]
          : []),
        ...(!direction && (startDate || endDate)
          ? [
              {
                OR: [
                  {
                    entry: {
                      entryDate: {
                        ...(startDate && { gte: new Date(startDate.setHours(0, 0, 0, 0)) }),
                        ...(endDate && { lte: new Date(endDate.setHours(23, 59, 59, 999)) }),
                      },
                    },
                  },
                  {
                    exit: {
                      exitDate: {
                        ...(startDate && { gte: new Date(startDate.setHours(0, 0, 0, 0)) }),
                        ...(endDate && { lte: new Date(endDate.setHours(23, 59, 59, 999)) }),
                      },
                    },
                  },
                ],
              },
            ]
          : []),
        ...(operatorId
          ? [
              {
                OR: [
                  { entry: { operatorId: { equals: operatorId } } },
                  { exit: { operatorId: { equals: operatorId } } },
                ],
              },
            ]
          : []),
      ],
    };

    const [medicinesExits, totalCount] = await this.prisma.$transaction([
      this.prisma.movimentation.findMany({
        where: whereClause,
        include: {
          entry: {
            select: {
              entryType: true,
              movementType: {
                select: { name: true },
              },
              operator: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          exit: {
            select: {
              movementType: {
                select: { name: true },
              },
              exitType: true,
              operator: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          correctionEntry: {
            select: {
              operator: {
                select: { id: true, name: true },
              },
            },
          },
          batchStock: {
            include: {
              medicineVariant: {
                select: {
                  pharmaceuticalForm: {
                    select: { id: true, name: true },
                  },
                  id: true,
                  unitMeasure: { select: { acronym: true, id: true } },
                  medicine: { select: { id: true, name: true } },
                  dosage: true,
                },
              },
              batch: {
                select: {
                  code: true,
                },
              },
              stock: { select: { name: true } },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...(params && params.page
          ? {
              take: params.perPage ?? 10,
              skip: (params.page - 1) * (params.perPage ?? 10),
            }
          : {}),
      }),
      this.prisma.movimentation.count({
        where: whereClause,
      }),
    ]);

    const movimentationMapped = medicinesExits.map((movimentation) => {
      return MovimentationDetails.create({
        id: new UniqueEntityId(movimentation.id),
        direction: movimentation.direction,
        medicineStockId: new UniqueEntityId(
          movimentation.batchStock.medicineStockId,
        ),
        batchStockId: new UniqueEntityId(movimentation.batchStockId),
        batchCode: movimentation.batchStock.batch.code,
        movementDate: movimentation.createdAt,
        exitType: movimentation.exit?.exitType
          ? ExitType[movimentation.exit.exitType]
          : undefined,
        operator:
          movimentation.direction === 'ENTRY'
            ? (movimentation.entry?.operator.name ?? '')
            : movimentation.correctionEntry
              ? (movimentation.correctionEntry.operator.name ?? '')
              : (movimentation.exit?.operator.name ?? ''),
        movementType:
          movimentation.direction === 'ENTRY'
            ? movimentation.entry?.entryType === 'MOVEMENT_TYPE'
              ? (movimentation.entry.movementType?.name ?? '')
              : (movimentation.entry?.entryType ?? '')
            : movimentation.correctionEntry
              ? 'CORRECTION'
              : movimentation.exit?.exitType === 'MOVEMENT_TYPE'
                ? (movimentation.exit.movementType?.name ?? '')
                : (movimentation.exit?.exitType ?? ''),
        stock: movimentation.batchStock.stock.name,
        medicine: movimentation.batchStock.medicineVariant.medicine.name,
        dosage: movimentation.batchStock.medicineVariant.dosage,
        pharmaceuticalForm:
          movimentation.batchStock.medicineVariant.pharmaceuticalForm.name,
        unitMeasure:
          movimentation.batchStock.medicineVariant.unitMeasure.acronym,
        quantity: movimentation.quantity,
        medicineId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.medicine.id,
        ),
        medicineVariantId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.id,
        ),
        operatorId:
          movimentation.direction === 'ENTRY'
            ? new UniqueEntityId(movimentation.entry?.operator.id)
            : movimentation.correctionEntry
              ? new UniqueEntityId(movimentation.correctionEntry.operator.id)
              : new UniqueEntityId(movimentation.exit?.operator.id),
        pharmaceuticalFormId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.pharmaceuticalForm.id,
        ),
        stockId: new UniqueEntityId(),
        unitMeasureId: new UniqueEntityId(),
        complement: '',
        movementTypeId: new UniqueEntityId(),
      });
    });

    return {
      movimentation: movimentationMapped,
      meta: {
        totalCount,
        page: params && params.page ? params.page : 1,
      },
    };
  }
}
