import { MetaReport } from "@/core/repositories/meta";
import { MovimentationRepository } from "@/domain/pharma/application/repositories/movimentation-repository";
import { ExitType } from "@/domain/pharma/enterprise/entities/exit";
import { MovementDirection } from "@/domain/pharma/enterprise/entities/movement-type";
import { Movimentation } from "@/domain/pharma/enterprise/entities/movimentation";
import { MovimentationDetails } from "@/domain/pharma/enterprise/entities/value-objects/movimentation-details";
import { Injectable } from "@nestjs/common";
import { PrismaMovimentationMapper } from "../mappers/prisma-movimentation-mapper";
import { PrismaService } from "../prisma.service";
import { $Enums, type Prisma } from "prisma/generated";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaMovimentationRepository implements MovimentationRepository {
  constructor(private prisma: PrismaService) {}

  async create(movimentation: Movimentation): Promise<void> {
    const data = PrismaMovimentationMapper.toPrisma(movimentation);
    await this.prisma.movimentation.create({
      data,
    });
  }

  async fetchMovimentation(filters: {
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
  }): Promise<{ movimentation: MovimentationDetails[]; meta: MetaReport }> {
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
      ...(direction === "EXIT"
        ? {
            exit: {
              ...((startDate || endDate) && {
                ...(startDate && {
                  exitDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) },
                }),
                ...(endDate && {
                  exitDate: {
                    lte: new Date(endDate.setHours(23, 59, 59, 999)),
                  },
                }),
              }),
              ...(exitType && {
                exitType: { equals: $Enums.ExitType[exitType] },
              }),
            },
          }
        : direction === "ENTRY"
        ? {
            ...((startDate || endDate) && {
              entry: {
                ...(startDate && {
                  entryDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) },
                }),
                ...(endDate && {
                  entryDate: {
                    lte: new Date(endDate.setHours(23, 59, 59, 999)),
                  },
                }),
              },
            }),
          }
        : {}),
      ...(!direction && (startDate || endDate)
        ? {
            OR: [
              {
                entry: {
                  ...(startDate && {
                    entryDate: {
                      gte: new Date(startDate.setHours(0, 0, 0, 0)),
                    },
                  }),
                  ...(endDate && {
                    entryDate: {
                      lte: new Date(endDate.setHours(23, 59, 59, 999)),
                    },
                  }),
                },
              },
              {
                exit: {
                  ...(startDate && {
                    exitDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) },
                  }),
                  ...(endDate && {
                    exitDate: {
                      lte: new Date(endDate.setHours(23, 59, 59, 999)),
                    },
                  }),
                },
              },
            ],
          }
        : {}),

      ...(movementTypeId && {
        movementTypeId: { equals: movementTypeId },
      }),
      ...(operatorId && {
        operatorId: { equals: operatorId },
      }),
    };

    const [medicinesExits, totalCount] = await this.prisma.$transaction([
      this.prisma.movimentation.findMany({
        where: whereClause,
        include: {
          entry: {
            select: {
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
              exitType: true,
              operator: {
                select: {
                  id: true,
                  name: true,
                },
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
          movementType: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.movimentation.count({
        where: whereClause,
      }),
    ]);

    const movimentationMapped = medicinesExits.map((movimentation) => {
      return MovimentationDetails.create({
        direction: movimentation.direction,
        medicineStockId: new UniqueEntityId(
          movimentation.batchStock.medicineStockId
        ),
        batchStockId: new UniqueEntityId(movimentation.batchStockId),
        batchCode: movimentation.batchStock.batch.code,
        movementDate: movimentation.createdAt,
        exitType: movimentation.exit?.exitType
          ? ExitType[movimentation.exit.exitType]
          : undefined,
        operator:
          movimentation.direction === "ENTRY"
            ? movimentation.entry?.operator.name ?? ""
            : movimentation.exit?.operator.name ?? "",
        movementType:
          movimentation.direction === "ENTRY"
            ? movimentation.movementType?.name ?? ""
            : movimentation.exit?.exitType === "MOVEMENT_TYPE"
            ? movimentation.movementType?.name ?? ""
            : movimentation.exit?.exitType ?? "",
        stock: movimentation.batchStock.stock.name,
        medicine: movimentation.batchStock.medicineVariant.medicine.name,
        dosage: movimentation.batchStock.medicineVariant.dosage,
        pharmaceuticalForm:
          movimentation.batchStock.medicineVariant.pharmaceuticalForm.name,
        unitMeasure:
          movimentation.batchStock.medicineVariant.unitMeasure.acronym,
        quantity: movimentation.quantity,
        medicineId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.medicine.id
        ),
        medicineVariantId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.id
        ),
        operatorId:
          movimentation.direction === "ENTRY"
            ? new UniqueEntityId(movimentation.entry?.operator.id)
            : new UniqueEntityId(movimentation.exit?.operator.id),
        pharmaceuticalFormId: new UniqueEntityId(
          movimentation.batchStock.medicineVariant.pharmaceuticalForm.id
        ),
        stockId: new UniqueEntityId(),
        unitMeasureId: new UniqueEntityId(),
        complement: "",
        movementTypeId: new UniqueEntityId(),
      });
    });

    return {
      movimentation: movimentationMapped,
      meta: {
        totalCount,
      },
    };
  }
}
