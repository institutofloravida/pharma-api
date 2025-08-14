import { type Meta } from '@/core/repositories/meta';
import { MovimentationRepository } from '@/domain/pharma/application/repositories/movimentation-repository';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { MovementDirection } from '@/domain/pharma/enterprise/entities/movement-type';
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation';
import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details';
import { InMemoryMedicinesExitsRepository } from './in-memory-medicines-exits-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository';
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository';
import { InMemoryMedicinesStockRepository } from './in-memory-medicines-stock-repository';
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository';
import { InMemoryOperatorsRepository } from './in-memory-operators-repository';
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms';
import { InMemoryStocksRepository } from './in-memory-stocks-repository';
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository';
import { InMemoryMedicinesEntriesRepository } from './in-memory-medicines-entries-repository';
import { InMemoryMovementTypesRepository } from './in-memory-movement-types-repository';
import { InMemoryBatchesRepository } from './in-memory-batches-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryMovimentationRepository
  implements MovimentationRepository
{
  public items: Movimentation[] = [];
  constructor(
    private operatorsRepository: InMemoryOperatorsRepository,
    private medicinesStocksRepository: InMemoryMedicinesStockRepository,
    private stocksRepository: InMemoryStocksRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private medicinesVariantsRepository: InMemoryMedicinesVariantsRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private batchesRepository: InMemoryBatchesRepository,
    private batchesStockRepository: InMemoryBatchStocksRepository,
    private movementTypesRepository: InMemoryMovementTypesRepository,
  ) {}

  private entriesRepository?: InMemoryMedicinesEntriesRepository;
  private exitsRepository?: InMemoryMedicinesExitsRepository;

  public setEntriesRepository(repo: InMemoryMedicinesEntriesRepository): void {
    this.entriesRepository = repo;
  }

  public setExitsRepository(repo: InMemoryMedicinesExitsRepository): void {
    this.exitsRepository = repo;
  }

  private getEntriesRepository(): InMemoryMedicinesEntriesRepository {
    if (!this.entriesRepository) {
      throw new Error('entries repository não foi injetado.');
    }
    return this.entriesRepository;
  }

  private getExitsRepository(): InMemoryMedicinesExitsRepository {
    if (!this.exitsRepository) {
      throw new Error('exits repository não foi injetado.');
    }
    return this.exitsRepository;
  }

  async create(movimentation: Movimentation): Promise<void> {
    this.items.push(movimentation);
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
      exitId?: string;
      entryId?: string;
      quantity?: number;
      movementTypeId?: string;
      direction?: MovementDirection;
      exitType?: ExitType;
    },
    params: PaginationParams,
  ): Promise<{ movimentation: MovimentationDetails[]; meta: Meta }> {
    const {
      institutionId,
      startDate,
      endDate,
      batcheStockId,
      exitType,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      operatorId,
      quantity,
      stockId,
      direction,
      entryId,
      exitId,
    } = filters;

    const movimentationFilteredAndMapped: MovimentationDetails[] = [];

    for (const movimentation of this.items) {
      if (direction && movimentation.direction !== direction) {
        continue;
      }

      if (
        entryId &&
        !movimentation.entryId?.equal(new UniqueEntityId(entryId))
      ) {
        continue;
      }

      if (exitId && !movimentation.exitId?.equal(new UniqueEntityId(exitId))) {
        continue;
      }

      let movement;
      if (movimentation.direction === 'ENTRY') {
        if (!movimentation.entryId) {
          throw new Error(
            'Movimentation entryId is required for ENTRY direction.',
          );
        }

        movement = this.getEntriesRepository().items.find((entry) =>
          entry.id.equal(
            movimentation.entryId
              ? movimentation.entryId
              : new UniqueEntityId(),
          ),
        );
      }

      if (movimentation.direction === 'EXIT') {
        if (!movimentation.exitId) {
          throw new Error(
            'Movimentation exitId is required for EXIT direction.',
          );
        }

        movement = this.getExitsRepository().items.find((exit) =>
          exit.id.equal(
            movimentation.exitId ? movimentation.exitId : new UniqueEntityId(),
          ),
        );
      }

      const batchStock = this.batchesStockRepository.items.find((item) =>
        item.id.equal(movimentation.batchestockId),
      );
      if (!batchStock) {
        throw new Error(
          `Batchstock with id "${movimentation.batchestockId.toString()} does not exist."`,
        );
      }

      const medicineStock = this.medicinesStocksRepository.items.find((item) =>
        item.id.equal(batchStock.medicineStockId),
      );

      if (!medicineStock) {
        throw new Error(
          `Medicine Stock with id "${batchStock.medicineStockId.toString()} does not exist."`,
        );
      }

      const medicineVariant = this.medicinesVariantsRepository.items.find(
        (item) => item.id.equal(medicineStock.medicineVariantId),
      );

      if (!medicineVariant) {
        throw new Error(
          `Medicine variant with id "${medicineStock.medicineVariantId.toString()} does not exist."`,
        );
      }

      const medicine = this.medicinesRepository.items.find((item) =>
        item.id.equal(medicineVariant.medicineId),
      );

      if (!medicine) {
        throw new Error(
          `Medicine with id "${medicineVariant.medicineId.toString()} does not exist."`,
        );
      }

      const pharmaceuticalForm = this.pharmaceuticalFormsRepository.items.find(
        (item) => item.id.equal(medicineVariant.pharmaceuticalFormId),
      );

      if (!pharmaceuticalForm) {
        throw new Error(
          `Pharmaceutical Form with id "${medicineVariant.pharmaceuticalFormId.toString()} does not exist."`,
        );
      }

      const unitMeasure = this.unitsMeasureRepository.items.find((item) =>
        item.id.equal(medicineVariant.unitMeasureId),
      );

      if (!unitMeasure) {
        throw new Error(
          `Unit Measure with id "${medicineVariant.unitMeasureId.toString()} does not exist."`,
        );
      }

      const movementType = this.movementTypesRepository.items.find((item) =>
        item.id.equal(movimentation.movementTypeId ?? new UniqueEntityId('')),
      );

      const operator = this.operatorsRepository.items.find((item) =>
        item.id.equal(movement.operatorId),
      );

      if (!operator) {
        throw new Error(
          `operator with id "${movement.operatorId.toString()} does not exist."`,
        );
      }

      const batch = this.batchesRepository.items.find((batch) =>
        batch.id.equal(batchStock.batchId),
      );
      if (!batch) {
        throw new Error(
          `batch with id "${batchStock.batchId.toString} does not exist."`,
        );
      }

      const stock = this.stocksRepository.items.find((stock) =>
        stock.id.equal(batchStock.stockId),
      );
      if (!stock) {
        throw new Error(
          `stock with id "${batchStock.stockId.toString()} does not exist."`,
        );
      }

      if (startDate) {
        if (
          startDate &&
          movimentation.direction === 'ENTRY' &&
          movement.entryDate < new Date(startDate.setHours(0, 0, 0, 0))
        ) {
          continue;
        }
        if (
          startDate &&
          movimentation.direction === 'EXIT' &&
          movement.exitDate < new Date(startDate.setHours(0, 0, 0, 0))
        ) {
          continue;
        }
      }
      if (endDate) {
        if (
          endDate &&
          movimentation.direction === 'ENTRY' &&
          movement.entryDate > new Date(endDate.setHours(23, 59, 59, 999))
        ) {
          continue;
        }
        if (
          endDate &&
          movimentation.direction === 'EXIT' &&
          movement.exitDate > new Date(endDate.setHours(23, 59, 59, 999))
        ) {
          continue;
        }
      }

      if (
        institutionId &&
        !stock.institutionId.equal(new UniqueEntityId(institutionId))
      ) {
        continue;
      }

      if (
        exitType &&
        movimentation.direction === 'EXIT' &&
        exitType !== movement.exitType
      ) {
        continue;
      }

      if (medicineId && !medicine.id.equal(new UniqueEntityId(medicineId))) {
        continue;
      }

      if (
        medicineVariantId &&
        !medicineVariant.id.equal(new UniqueEntityId(medicineVariantId))
      ) {
        continue;
      }

      if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) {
        continue;
      }

      if (
        medicineStockId &&
        !medicineStock.id.equal(new UniqueEntityId(medicineStockId))
      ) {
        continue;
      }

      if (
        batcheStockId &&
        !batchStock.id.equal(new UniqueEntityId(batcheStockId))
      ) {
        continue;
      }

      if (
        movementTypeId &&
        !movimentation.movementTypeId?.equal(new UniqueEntityId(movementTypeId))
      ) {
        continue;
      }

      if (
        operatorId &&
        !movement.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        continue;
      }

      if (quantity && movimentation.quantity !== quantity) {
        continue;
      }

      const movimentationDetails = MovimentationDetails.create({
        id: movimentation.id,
        direction: 'EXIT',
        batchStockId: batchStock.id,
        dosage: medicineVariant.dosage,
        medicine: medicine.content,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
        medicineStockId: medicineStock.id,
        exitType:
          movimentation.direction === 'EXIT' ? movement.exitType : undefined,
        movementDate:
          movimentation.direction === 'ENTRY'
            ? movement.entryDate
            : movement.exitDate,
        movementType: movementType
          ? movementType.content
          : movement.movementType,
        quantity: movimentation.quantity,
        stock: stock.content,
        operator: operator.name,
        batchCode: batch.code,
        medicineId: medicine.id,
        medicineVariantId: medicineVariant.id,
        movementTypeId: movementType ? movementType.id : undefined,
        operatorId: operator.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        stockId: stock.id,
        unitMeasureId: unitMeasure.id,
        complement: medicineVariant.complement,
      });

      movimentationFilteredAndMapped.push(movimentationDetails);
    }

    const movimentationPaginated =
      params && params.page
        ? movimentationFilteredAndMapped.slice(
            (params.page - 1) * (params.perPage ?? 10),
            params.page * (params.perPage ?? 10),
          )
        : [];

    return {
      movimentation:
        params && params.page
          ? movimentationPaginated
          : movimentationFilteredAndMapped,
      meta: {
        page: params && params.page ? params.page : 1,
        totalCount: movimentationFilteredAndMapped.length,
      },
    };
  }
}
