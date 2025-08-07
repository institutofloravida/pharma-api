import { TransferRepository } from '@/domain/pharma/application/repositories/transfer-repository';
import {
  Transfer,
  TransferStatus,
} from '@/domain/pharma/enterprise/entities/transfer';
import { PrismaTransferMapper } from '../mappers/prisma-transfer-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { TransferDetails } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-details';
import { $Enums, Prisma } from 'prisma/generated';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor(private prisma: PrismaService) {}

  async create(transfer: Transfer): Promise<void> {
    const data = PrismaTransferMapper.toPrisma(transfer);
    await this.prisma.transfer.create({ data });
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
    });
    return transfer ? PrismaTransferMapper.toDomain(transfer) : null;
  }

  async save(transfer: Transfer): Promise<void> {
    const data = PrismaTransferMapper.toPrisma(transfer);
    await this.prisma.transfer.update({
      where: { id: transfer.id.toString() },
      data,
    });
  }

  async findByIdWithMovimentation(
    id: string,
  ): Promise<TransferWithMovimentation | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: {
        exit: {
          include: {
            movimentation: {
              include: {
                batchStock: {
                  include: {
                    batch: {
                      select: {
                        manufacturer: true,
                        expirationDate: true,
                        code: true,
                      },
                    },
                    medicineVariant: {
                      select: {
                        medicine: true,
                        pharmaceuticalForm: true,
                        unitMeasure: true,
                        dosage: true,
                        complement: true,
                      },
                    },
                  },
                },
              },
            },

            stock: {
              include: {
                institution: true,
              },
            },
            operator: true,
          },
        },
        entry: {
          include: {
            stock: {
              include: {
                institution: true,
              },
            },
          },
        },
      },
    });

    return transfer
      ? TransferWithMovimentation.create({
          transferId: new UniqueEntityId(transfer.id),
          transferDate: transfer.exit ? transfer.exit.exitDate : new Date(),
          operator: transfer.exit ? transfer.exit.operator.name : '',
          status: TransferStatus[transfer.status],
          institutionOrigin: transfer.exit?.stock.institution
            ? transfer.exit.stock.institution.name
            : '',
          institutionDestination: transfer.entry?.stock.institution
            ? transfer.entry.stock.institution.name
            : '',
          stockOrigin: transfer.exit ? transfer.exit.stock.name : '',
          stockDestination: transfer.entry?.stock.name ?? '',
          batches: transfer.exit?.movimentation
            ? transfer.exit.movimentation.map((movimentation) => ({
                medicine:
                  movimentation.batchStock.medicineVariant.medicine.name,
                pharmaceuticalForm:
                  movimentation.batchStock.medicineVariant.pharmaceuticalForm
                    .name,
                unitMeasure:
                  movimentation.batchStock.medicineVariant.unitMeasure.acronym,
                dosage: movimentation.batchStock.medicineVariant.dosage,
                complement:
                  movimentation.batchStock.medicineVariant.complement ??
                  undefined,
                batchId: new UniqueEntityId(movimentation.batchStock.batchId),
                code: movimentation.batchStock.batch.code,
                manufacturer: movimentation.batchStock.batch.manufacturer.name,
                expirationDate: movimentation.batchStock.batch.expirationDate,
                quantity: movimentation.quantity,
              }))
            : [],
          confirmedAt: transfer.confirmedAt ?? null,
        })
      : null;
  }

  async findMany(
    { page, perPage = 10 }: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      status?: TransferStatus;
      transferDate?: Date;
    },
  ): Promise<{ transfers: TransferDetails[]; meta: Meta }> {
    const { institutionId, operatorId, status, transferDate } = filters;

    const whereClause: Prisma.TransferWhereInput = {
      exit: {
        stock: {
          institutionId: {
            equals: institutionId,
          },
        },
        ...(operatorId && {
          operatorId: {
            equals: operatorId,
          },
        }),
        ...(transferDate && {
          exitDate: {
            gte: transferDate,
            lte: transferDate,
          },
        }),
      },
      ...(status && {
        status: {
          equals: $Enums.TransferStatus[status],
        },
      }),
    };

    const [transfers, totalCount] = await this.prisma.$transaction([
      this.prisma.transfer.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { exit: { exitDate: 'desc' } },
        include: {
          exit: {
            select: {
              id: true,
              exitDate: true,
              transferId: true,
              movimentation: {
                select: {
                  id: true,
                },
              },
              stock: {
                select: { name: true, institution: { select: { name: true } } },
              },
              operator: {
                select: { name: true },
              },
            },
          },
          entry: {
            select: {
              stock: {
                select: {
                  name: true,
                  institution: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.transfer.count({ where: whereClause }),
    ]);

    const transfersMapped = transfers.map((transfer) => {
      return TransferDetails.create({
        transferDate: transfer.exit?.exitDate || new Date(),
        operator: transfer.exit?.operator.name || '',
        stockOrigin: transfer.exit?.stock.name || '',
        institutionDestination: transfer.entry?.stock.institution?.name || '',
        status: TransferStatus[transfer.status],
        transferId: new UniqueEntityId(transfer.id),
        confirmedAt: transfer.confirmedAt || null,
        batches: transfer.exit?.movimentation.length || 0,
        stockDestination: transfer.entry?.stock.name || '',
        institutionOrigin: transfer.exit?.stock.institution?.name || '',
      });
    });
    return {
      transfers: transfersMapped,
      meta: {
        page,
        totalCount,
      },
    };
  }
}
