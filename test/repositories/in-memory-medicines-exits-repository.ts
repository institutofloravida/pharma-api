import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository';
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit';
import { InMemoryStocksRepository } from './in-memory-stocks-repository';
import { InMemoryOperatorsRepository } from './in-memory-operators-repository';
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details';
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository';

export class InMemoryMedicinesExitsRepository
  implements MedicinesExitsRepository
{
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
  ) {}

  public items: MedicineExit[] = [];
  async create(medicineExit: MedicineExit) {
    this.items.push(medicineExit);
  }

  async findById(id: string): Promise<MedicineExit | null> {
    const medicineExit = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );

    if (!medicineExit) {
      return null;
    }
    return medicineExit;
  }

  async findByIdWithDetails(id: string): Promise<ExitDetails | null> {
    const medicineExit = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );

    if (!medicineExit) {
      return null;
    }

    const operator = this.operatorsRepository.items.find((item) =>
      item.id.equal(medicineExit.operatorId),
    );

    if (!operator) {
      throw new Error(
        `operator with id "${medicineExit.operatorId.toString()} does not exist."`,
      );
    }

    const stock = this.stocksRepository.items.find((stock) =>
      stock.id.equal(medicineExit.stockId),
    );
    if (!stock) {
      throw new Error(
        `stock with id "${medicineExit.stockId.toString()} does not exist."`,
      );
    }

    const items = this.movimentationRepository.items.filter((movimentation) => {
      return movimentation.exitId
        ? movimentation.exitId?.equal(medicineExit.id)
        : false;
    });

    return ExitDetails.create({
      exitDate: medicineExit.exitDate,
      stock: stock.content,
      exitType: medicineExit.exitType,
      operator: operator.name,
      stockId: stock.id,
      exitId: medicineExit.id,
      items: items.length,
    });
  }

  async findByTransferId(transferId: string): Promise<MedicineExit | null> {
    const exit = this.items.find((exit) =>
      exit.transferId?.equal(new UniqueEntityId(transferId)),
    );
    if (!exit) {
      return null;
    }

    return exit;
  }

  async save(medicineExit: MedicineExit): Promise<void> {
    const itemIndex = this.items.findIndex((exit) =>
      exit.id.equal(medicineExit.id),
    );
    this.items[itemIndex] = medicineExit;
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      institutionId?: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }> {
    const { institutionId, exitDate, exitType, operatorId } = filters;
    const medicinesExitsFilteredAndMapped: ExitDetails[] = [];

    for (const exit of this.items) {
      const operator = this.operatorsRepository.items.find((item) =>
        item.id.equal(exit.operatorId),
      );

      if (!operator) {
        throw new Error(
          `operator with id "${exit.operatorId.toString()} does not exist."`,
        );
      }

      const stock = this.stocksRepository.items.find((stock) =>
        stock.id.equal(exit.stockId),
      );
      if (!stock) {
        throw new Error(
          `stock with id "${exit.stockId.toString()} does not exist."`,
        );
      }

      if (
        institutionId &&
        !stock.institutionId.equal(new UniqueEntityId(institutionId))
      ) {
        continue;
      }

      if (
        exitDate &&
        !(
          exit.exitDate.getDate() === exitDate.getDate() &&
          exit.exitDate.getMonth() === exitDate.getMonth() &&
          exit.exitDate.getFullYear() === exitDate.getFullYear()
        )
      ) {
        continue;
      }

      if (exitType && exitType !== exit.exitType) {
        continue;
      }

      if (
        operatorId &&
        !exit.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        continue;
      }

      const items = this.movimentationRepository.items.filter(
        (movimentation) => {
          return movimentation.exitId
            ? movimentation.exitId?.equal(exit.id)
            : false;
        },
      );

      const medicineExitDetails = ExitDetails.create({
        exitDate: exit.exitDate,
        stock: stock.content,
        operator: operator.name,
        stockId: stock.id,
        exitId: exit.id,
        exitType: exit.exitType,
        items: items.length,
      });

      medicinesExitsFilteredAndMapped.push(medicineExitDetails);
    }

    const medicinesPaginated = medicinesExitsFilteredAndMapped.slice(
      (page - 1) * 10,
      page * 10,
    );

    return {
      medicinesExits: medicinesPaginated,
      meta: {
        page,
        totalCount: medicinesExitsFilteredAndMapped.length,
      },
    };
  }
}
