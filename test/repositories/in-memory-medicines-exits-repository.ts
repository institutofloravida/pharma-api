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
import { ExitWithStock } from '@/domain/pharma/enterprise/entities/value-objects/exit-with-stock';
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository';
import {
  ExitDetails,
  type ExitDetailsMedicineProps,
} from '@/domain/pharma/enterprise/entities/value-objects/exit-details';
import { InMemoryMovementTypesRepository } from './in-memory-movement-types-repository';
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository';
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository';
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository';
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository';
import { InMemoryBatchesRepository } from './in-memory-batches-repository';
import { InMemoryManufacturersRepository } from './in-memory-manufacturers-repository';
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository';

export class InMemoryMedicinesExitsRepository
  implements MedicinesExitsRepository
{
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private movimentationRepository: InMemoryMovimentationRepository,
    private movementTypesRepository: InMemoryMovementTypesRepository,
    private batchesStockRepository: InMemoryBatchStocksRepository,
    private medicinesVariantRepository: InMemoryMedicinesVariantsRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private manufacturersRepository: InMemoryManufacturersRepository,
    private batchesRepository: InMemoryBatchesRepository,
    private institutionsRepository: InMemoryInstitutionsRepository,
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

  async findByIdWithStock(id: string): Promise<ExitWithStock | null> {
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

    return ExitWithStock.create({
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

  async findByIdWithDetails(id: string): Promise<ExitDetails | null> {
    const exit = this.items.find((exit) =>
      exit.id.equal(new UniqueEntityId(id)),
    );
    if (!exit) {
      return null;
    }

    const stock = this.stocksRepository.items.find((stock) =>
      stock.id.equal(exit.stockId),
    );

    if (!stock) {
      throw new Error(
        `stock with id "${exit.stockId.toString()} does not exist."`,
      );
    }

    const operator = this.operatorsRepository.items.find((operator) =>
      operator.id.equal(exit.operatorId),
    );

    if (!operator) {
      throw new Error(
        `operator with id "${exit.operatorId.toString()} does not exist."`,
      );
    }
    let movementType;
    if (exit.movementTypeId) {
      movementType = this.movementTypesRepository.items.find((movementType) =>
        movementType.id.equal(exit.movementTypeId!),
      );

      if (!movementType) {
        throw new Error(
          `movement type with id "${exit.movementTypeId.toString()} does not exist."`,
        );
      }
    }

    const movimentations = this.movimentationRepository.items.filter(
      (movement) => movement.exitId?.equal(new UniqueEntityId(id)),
    );
    const medicines: ExitDetailsMedicineProps[] = [];

    for (const movement of movimentations) {
      const batchStock = this.batchesStockRepository.items.find((item) =>
        item.id.equal(movement.batchestockId),
      );

      if (!batchStock) {
        throw new Error(
          `batch stock with id "${movement.batchestockId.toString()} does not exist."`,
        );
      }

      const medicineIsAdded = medicines.find(
        (item) =>
          item.medicineStockId === batchStock.medicineStockId.toString(),
      );

      if (!medicineIsAdded) {
        const medicineVariant = this.medicinesVariantRepository.items.find(
          (item) =>
            item.id.toString() === batchStock.medicineVariantId.toString(),
        );

        if (!medicineVariant) {
          throw new Error(
            `medicine variant with id "${batchStock.medicineVariantId.toString()} does not exist."`,
          );
        }

        const medicine = this.medicinesRepository.items.find((item) =>
          item.id.equal(medicineVariant.medicineId),
        );
        if (!medicine) {
          throw new Error(
            `medicine with id "${medicineVariant.medicineId.toString()} does not exist."`,
          );
        }

        const pharmaceuticalForm =
          this.pharmaceuticalFormsRepository.items.find((item) =>
            item.id.equal(medicineVariant.pharmaceuticalFormId),
          );
        if (!pharmaceuticalForm) {
          throw new Error(
            `pharmaceutical form id "${medicineVariant.pharmaceuticalFormId.toString()} does not exist."`,
          );
        }

        const unitMeasure = this.unitsMeasureRepository.items.find((item) =>
          item.id.equal(medicineVariant.unitMeasureId),
        );
        if (!unitMeasure) {
          throw new Error(
            `unit measure id "${medicineVariant.unitMeasureId.toString()} does not exist."`,
          );
        }

        medicines.push({
          batches: [],
          dosage: medicineVariant.dosage,
          medicineName: medicine.content,
          medicineStockId: batchStock.medicineStockId.toString(),
          pharmaceuticalForm: pharmaceuticalForm.content,
          unitMeasure: unitMeasure.content,
          complement: medicineVariant.complement ?? undefined,
        });
      }

      const medicineIndex = medicines.findIndex(
        (item) =>
          item.medicineStockId === batchStock.medicineStockId.toString(),
      );

      const batch = this.batchesRepository.items.find((item) =>
        item.id.equal(batchStock.batchId),
      );

      if (!batch) {
        throw new Error(
          `batch with id "${batchStock.batchId.toString()} does not exist."`,
        );
      }

      const manufacturer = this.manufacturersRepository.items.find((item) =>
        item.id.equal(batch.manufacturerId),
      );

      if (!manufacturer) {
        throw new Error(
          `manufacturer with id "${batch.manufacturerId.toString()} does not exist."`,
        );
      }

      medicines[medicineIndex].batches.push({
        batchNumber: batch.code,
        expirationDate: batch.expirationDate,
        manufacturingDate: batch.manufacturingDate ?? undefined,
        manufacturer: manufacturer.content,
        quantity: movement.quantity,
      });
    }
    let destinationInstitution;
    let responsibleByInstitution;
    if (exit.destinationInstitutionId) {
      const institution = this.institutionsRepository.items.find((item) =>
        item.id.equal(exit.destinationInstitutionId!),
      );

      if (!institution) {
        throw new Error(
          `institution with id "${exit.destinationInstitutionId.toString()} does not exist."`,
        );
      }
      destinationInstitution = institution.content;
      responsibleByInstitution = institution.responsible;
    }
    return ExitDetails.create({
      exitId: exit.id,
      exitDate: exit.exitDate,
      operator: operator.name,
      stock: stock.content,
      exitType: exit.exitType,
      movementType: movementType?.content,
      destinationInstitution,
      responsibleByInstitution,
      reverseAt: exit.reverseAt ?? undefined,
      medicines,
    });
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
      stockId?: string;
    },
  ): Promise<{ medicinesExits: ExitWithStock[]; meta: Meta }> {
    const { institutionId, exitDate, exitType, operatorId, stockId } = filters;
    const medicinesExitsFilteredAndMapped: ExitWithStock[] = [];

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
      if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) {
        continue;
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

      const medicineExitDetails = ExitWithStock.create({
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
