import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Meta } from '@/core/repositories/meta';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import { TransferRepository } from '@/domain/pharma/application/repositories/transfer-repository';
import {
  Transfer,
  type TransferStatus,
} from '@/domain/pharma/enterprise/entities/transfer';
import { TransferDetails } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-details';
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository';
import { InMemoryOperatorsRepository } from './in-memory-operators-repository';
import { InMemoryStocksRepository } from './in-memory-stocks-repository';
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository';
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository';
import { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';
import { InMemoryBatchesRepository } from './in-memory-batches-repository';
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository';
import { InMemoryManufacturersRepository } from './in-memory-manufacturers-repository';

export class InMemoryTransferRepository implements TransferRepository {
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
    private exitsRepository: InMemoryMedicinesExitsRepository,
    private institutionsRepository: InMemoryInstitutionsRepository,
    private batchesRepository: InMemoryBatchesRepository,
    private batchStocksRepository: InMemoryBatchStocksRepository,
    private manufacturersRepository: InMemoryManufacturersRepository,
  ) {}

  public items: Transfer[] = [];

  async create(transfer: Transfer): Promise<void> {
    this.items.push(transfer);
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );
    if (!transfer) {
      return null;
    }
    return transfer;
  }

  async save(transfer: Transfer): Promise<void> {
    const itemIndex = this.items.findIndex((tranfer) =>
      tranfer.id.equal(transfer.id),
    );
    this.items[itemIndex] = transfer;
  }

  async findByIdWithMovimentation(
    id: string,
  ): Promise<TransferWithMovimentation | null> {
    const transfer = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );
    if (!transfer) {
      return null;
    }

    const exit = this.exitsRepository.items.find((item) =>
      item.transferId?.equal(new UniqueEntityId(id)),
    );

    if (!exit) {
      throw new Error(` exit with transfer id "${id} does not exist."`);
    }

    const operator = this.operatorsRepository.items.find((item) =>
      item.id.equal(exit.operatorId),
    );

    if (!operator) {
      throw new Error(
        `operator with id "${exit.operatorId.toString()} does not exist."`,
      );
    }

    const stockOrigin = this.stocksRepository.items.find((stock) =>
      stock.id.equal(exit.stockId),
    );
    if (!stockOrigin) {
      throw new Error(
        `stock with id "${exit.stockId.toString()} does not exist."`,
      );
    }

    const stockDestination = this.stocksRepository.items.find((stock) =>
      stock.id.equal(transfer.stockDestinationId),
    );
    if (!stockDestination) {
      throw new Error(
        `stock with id "${transfer.stockDestinationId.toString()} does not exist."`,
      );
    }

    const institutionOrigin = this.institutionsRepository.items.find(
      (institution) => institution.id.equal(stockOrigin.institutionId),
    );
    if (!institutionOrigin) {
      throw new Error(
        `institution with id "${stockOrigin.institutionId.toString()} does not exist."`,
      );
    }

    const institutionDestination = this.institutionsRepository.items.find(
      (institution) => institution.id.equal(stockDestination.institutionId),
    );

    const batches = await this.movimentationRepository.fetchMovimentation({
      exitId: exit.id.toString(),
    });

    const batchesMapped = batches.movimentation.map((movimentation) => {
      const batchStock = this.batchStocksRepository.items.find((item) =>
        item.id.equal(movimentation.batchStockId),
      );
      if (!batchStock) {
        throw new Error(
          `Batch with id "${movimentation.batchStockId.toString()} does not exist."`,
        );
      }

      const batch = this.batchesRepository.items.find((item) =>
        item.id.equal(batchStock.batchId),
      );
      if (!batch) {
        throw new Error(
          `Batch with id "${batchStock.batchId.toString()} does not exist."`,
        );
      }

      const manufacturer = this.manufacturersRepository.items.find((item) =>
        item.id.equal(batch.manufacturerId),
      );
      if (!manufacturer) {
        throw new Error(
          `Manufacturer with id "${batch.manufacturerId.toString()} does not exist."`,
        );
      }

      return {
        medicine: movimentation.medicine,
        pharmaceuticalForm: movimentation.pharmaceuticalForm,
        unitMeasure: movimentation.unitMeasure,
        dosage: movimentation.dosage,
        complement: movimentation.complement ?? undefined,
        batchId: batch.id,
        code: batch.code,
        manufacturer: manufacturer.content,
        expirationDate: batch.expirationDate,
        quantity: movimentation.quantity,
      };
    });

    const tranferMapped = TransferWithMovimentation.create({
      transferId: transfer.id,
      transferDate: exit.exitDate,
      stockOrigin: stockOrigin.content,
      stockDestination: stockDestination.content,
      operator: operator.name,
      institutionOrigin: institutionOrigin.content,
      institutionDestination: institutionDestination?.content,
      confirmedAt: transfer.confirmedAt,
      status: transfer.status,
      batches: batchesMapped,
    });

    return tranferMapped;
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
    const transfersFilteredAndMapped: TransferDetails[] = [];

    for (const transfer of this.items) {
      const exit = this.exitsRepository.items.find((item) =>
        item.transferId?.equal(transfer.id),
      );

      if (!exit) {
        throw new Error(
          ` exit with transfer id "${transfer.id.toString()} does not exist."`,
        );
      }

      const operator = this.operatorsRepository.items.find((item) =>
        item.id.equal(exit.operatorId),
      );

      if (!operator) {
        throw new Error(
          `operator with id "${exit.operatorId.toString()} does not exist."`,
        );
      }

      const stockOrigin = this.stocksRepository.items.find((stock) =>
        stock.id.equal(exit.stockId),
      );
      if (!stockOrigin) {
        throw new Error(
          `stock with id "${exit.stockId.toString()} does not exist."`,
        );
      }

      const stockDestination = this.stocksRepository.items.find((stock) =>
        stock.id.equal(transfer.stockDestinationId),
      );
      if (!stockDestination) {
        throw new Error(
          `stock with id "${transfer.stockDestinationId.toString()} does not exist."`,
        );
      }

      if (
        !stockOrigin.institutionId.equal(new UniqueEntityId(institutionId)) &&
        !stockDestination.institutionId.equal(new UniqueEntityId(institutionId))
      ) {
        continue;
      }

      const institutionOrigin = this.institutionsRepository.items.find(
        (institution) => institution.id.equal(stockOrigin.institutionId),
      );
      if (!institutionOrigin) {
        throw new Error(
          `institution with id "${stockOrigin.institutionId.toString()} does not exist."`,
        );
      }

      const institutionDestination = this.institutionsRepository.items.find(
        (institution) => institution.id.equal(stockDestination.institutionId),
      );

      if (
        transferDate &&
        !(
          exit.exitDate.getDate() === transferDate.getDate() &&
          exit.exitDate.getMonth() === transferDate.getMonth() &&
          exit.exitDate.getFullYear() === transferDate.getFullYear()
        )
      ) {
        continue;
      }

      if (status && status !== transfer.status) {
        continue;
      }

      if (
        operatorId &&
        !exit.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        continue;
      }

      const batches = this.movimentationRepository.items.filter(
        (movimentation) => {
          return movimentation.exitId
            ? movimentation.exitId?.equal(exit.id)
            : false;
        },
      );

      const medicineTransferDetails = TransferDetails.create({
        transferId: transfer.id,
        transferDate: exit.exitDate,
        stockOrigin: stockOrigin.content,
        stockDestination: stockDestination.content,
        operator: operator.name,
        batches: batches.length,
        institutionOrigin: institutionOrigin.content,
        institutionDestination: institutionDestination?.content,
        confirmedAt: transfer.confirmedAt,
        status: transfer.status,
      });

      transfersFilteredAndMapped.push(medicineTransferDetails);
    }

    const medicinesPaginated = transfersFilteredAndMapped.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      transfers: medicinesPaginated,
      meta: {
        page,
        totalCount: transfersFilteredAndMapped.length,
      },
    };
  }
}
