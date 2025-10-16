import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository';
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry';
import { InMemoryStocksRepository } from './in-memory-stocks-repository';
import { InMemoryOperatorsRepository } from './in-memory-operators-repository';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { EntryWithStock } from '@/domain/pharma/enterprise/entities/value-objects/entry-with-stock';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryMovimentationRepository } from './in-memory-movimentation-repository';
import {
  EntryDetails,
  type EntryDetailsMedicineProps,
} from '@/domain/pharma/enterprise/entities/value-objects/entry-details';
import { InMemoryMovementTypesRepository } from './in-memory-movement-types-repository';
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository';
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository';
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository';
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository';
import { InMemoryBatchesRepository } from './in-memory-batches-repository';
import { InMemoryManufacturersRepository } from './in-memory-manufacturers-repository';

export class InMemoryMedicinesEntriesRepository
  implements MedicinesEntriesRepository
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
    private batchesRepository: InMemoryBatchesRepository,
    private manufacturersRepository: InMemoryManufacturersRepository,
  ) {}

  public items: MedicineEntry[] = [];

  async create(medicineEntry: MedicineEntry) {
    this.items.push(medicineEntry);
  }

  async findMany(
    { page, perPage = 10 }: PaginationParams,
    filters: {
      institutionId?: string;
      operatorId?: string;
      stockId?: string;
      entryDate?: Date;
    },
  ): Promise<{ entries: EntryWithStock[]; meta: Meta }> {
    const { institutionId, entryDate, operatorId, stockId } = filters;
    const medicinesEntries = this.items;

    const filteredByInstitution = medicinesEntries.filter((medicineEntry) => {
      const stock = this.stocksRepository.items.find((stock) => {
        return stock.id.equal(medicineEntry.stockId);
      });
      if (!stock) {
        throw new Error(
          `stock with id "${medicineEntry.stockId} does not exist."`,
        );
      }
      if (
        institutionId &&
        !stock.institutionId.equal(new UniqueEntityId(institutionId))
      ) {
        return false;
      }

      if (
        stockId &&
        !medicineEntry.stockId.equal(new UniqueEntityId(stockId))
      ) {
        return false;
      }

      if (
        operatorId &&
        !medicineEntry.operatorId.equal(new UniqueEntityId(operatorId))
      ) {
        return false;
      }
      if (
        entryDate &&
        medicineEntry.entryDate.toISOString().split('T')[0] !==
          entryDate.toISOString().split('T')[0]
      ) {
        return false;
      }

      return true;
    });

    const medicinesEntriesMapped = filteredByInstitution.map(
      (medicineEntryMapped) => {
        const stock = this.stocksRepository.items.find((stock) =>
          stock.id.equal(medicineEntryMapped.stockId),
        );

        if (!stock) {
          throw new Error(
            `stock with id "${medicineEntryMapped.stockId.toString()} does not exist."`,
          );
        }

        const operator = this.operatorsRepository.items.find((operator) =>
          operator.id.equal(medicineEntryMapped.operatorId),
        );

        if (!operator) {
          throw new Error(
            `operator with id "${medicineEntryMapped.id.toString()} does not exist."`,
          );
        }

        const items = this.movimentationRepository.items.filter((item) => {
          return item.entryId
            ? item.entryId.equal(medicineEntryMapped.id)
            : false;
        });

        return EntryWithStock.create({
          stock: stock.content,
          entryDate: medicineEntryMapped.entryDate,
          entryId: medicineEntryMapped.id,
          operator: operator.name,
          items: items.length,
          nfNumber: medicineEntryMapped.nfNumber,
        });
      },
    );

    const medicinesEntriesFilteredAndPaginated = medicinesEntriesMapped.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      entries: medicinesEntriesFilteredAndPaginated,
      meta: {
        page,
        totalCount: medicinesEntriesMapped.length,
      },
    };
  }

  async findByIdWithDetails(entryId: string): Promise<EntryDetails | null> {
    const entry = this.items.find((entry) =>
      entry.id.equal(new UniqueEntityId(entryId)),
    );
    if (!entry) {
      return null;
    }

    const stock = this.stocksRepository.items.find((stock) =>
      stock.id.equal(entry.stockId),
    );

    if (!stock) {
      throw new Error(
        `stock with id "${entry.stockId.toString()} does not exist."`,
      );
    }

    const operator = this.operatorsRepository.items.find((operator) =>
      operator.id.equal(entry.operatorId),
    );

    if (!operator) {
      throw new Error(
        `operator with id "${entry.operatorId.toString()} does not exist."`,
      );
    }
    let movementType;
    if (entry.movementTypeId) {
      movementType = this.movementTypesRepository.items.find((movementType) =>
        movementType.id.equal(entry.movementTypeId!),
      );

      if (!movementType) {
        throw new Error(
          `movement type with id "${entry.movementTypeId.toString()} does not exist."`,
        );
      }
    }

    const movimentations = this.movimentationRepository.items.filter(
      (movement) => movement.entryId?.equal(new UniqueEntityId(entryId)),
    );
    const medicines: EntryDetailsMedicineProps[] = [];

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

    return EntryDetails.create({
      entryId: entry.id,
      entryDate: entry.entryDate,
      operator: operator.name,
      stock: stock.content,
      nfNumber: entry.nfNumber ?? '',
      entryType: entry.entryType,
      movementType: movementType ? movementType.content : null,
      medicines,
    });
  }
}
