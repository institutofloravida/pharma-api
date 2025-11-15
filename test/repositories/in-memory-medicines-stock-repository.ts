import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository';
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock';
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details';
import { InMemoryStocksRepository } from './in-memory-stocks-repository';
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository';
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository';
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository';
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory';
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository';
import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details';
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository';
import { InMemoryBatchesRepository } from './in-memory-batches-repository';
import { InMemoryManufacturersRepository } from './in-memory-manufacturers-repository';

export class InMemoryMedicinesStockRepository
  implements MedicinesStockRepository
{
  constructor(
    private institutionsRepository: InMemoryInstitutionsRepository,
    private stocksRepository: InMemoryStocksRepository,
    private medicinesRepository: InMemoryMedicinesRepository,
    private medicinesVariantsRepository: InMemoryMedicinesVariantsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private batchesStocksRepository: InMemoryBatchStocksRepository,
    private batchesRepository: InMemoryBatchesRepository,
    private manufacturersRepository: InMemoryManufacturersRepository,
  ) {}

  public items: MedicineStock[] = [];

  async create(medicinestock: MedicineStock) {
    this.items.push(medicinestock);
  }

  async save(medicinestock: MedicineStock) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === medicinestock.id.toString(),
    );

    if (index === -1) {
      return null;
    }

    this.items[index] = medicinestock;
  }

  async addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null> {
    const itemIndex = await this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    );

    if (itemIndex === -1) {
      return null;
    }

    const medicineStock = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    );

    if (!medicineStock) {
      return null;
    }

    medicineStock?.addBatchStockId(new UniqueEntityId(batchStockId));
    this.items[itemIndex] = medicineStock;
  }

  async replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId);
    if (!medicineStock) {
      return null;
    }

    medicineStock.replenish(Number(quantity));
    await this.save(medicineStock);
    return medicineStock;
  }

  async subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId);
    if (!medicineStock) {
      return null;
    }

    medicineStock.subtract(Number(quantity));
    await this.save(medicineStock);
    return medicineStock;
  }

  async findById(id: string): Promise<MedicineStock | null> {
    const medicinestock = this.items.find((item) => item.id.toString() === id);
    if (!medicinestock) {
      return null;
    }

    return medicinestock;
  }

  async findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null> {
    const medicinestock = this.items.find(
      (item) =>
        item.medicineVariantId.toString() === medicineVariantId &&
        item.stockId.toString() === stockId,
    );
    if (!medicinestock) {
      return null;
    }

    return medicinestock;
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicineStockExists = this.items.find((item) => {
      return medicineStock.equals(item);
    });

    if (medicineStockExists) {
      return medicineStockExists;
    }

    return null;
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      stockId?: string;
      medicineVariantId?: string;
      medicineName?: string;
    },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }> {
    const { stockId, medicineName, medicineVariantId } = filters;

    const medicinesStock = this.items;

    const medicinesStockFiltered: MedicineStockDetails[] = [];
    for (const medicineStock of medicinesStock) {
      const stock = await this.stocksRepository.findById(
        medicineStock.stockId.toString(),
      );
      if (!stock) {
        throw new Error(`Estoque com Id ${stockId} não foi encontrado!`);
      }
      if (stockId && !stock.id.equal(new UniqueEntityId(stockId))) continue;

      const medicine = await this.medicinesRepository.findByMedicineVariantId(
        medicineStock.medicineVariantId.toString(),
      );

      if (!medicine) {
        throw new Error(
          `Medicamento contendo variant id ${medicineStock.medicineVariantId.toString()} não foi encontrado`,
        );
      }

      if (
        !medicine.content
          .toLowerCase()
          .includes(medicineName?.toLowerCase() ?? '')
      ) {
        continue;
      }

      const medicineVariant = await this.medicinesVariantsRepository.findById(
        medicineStock.medicineVariantId.toString(),
      );

      if (!medicineVariant) {
        throw new Error(
          `Variante de medicamento com id ${medicineStock.medicineVariantId.toString()} não foi encontrada`,
        );
      }

      if (
        medicineVariantId &&
        !medicineVariant.id.equal(new UniqueEntityId(medicineVariantId))
      ) {
        continue;
      }

      const pharmaceuticalForm =
        await this.pharmaceuticalFormsRepository.findById(
          medicineVariant?.pharmaceuticalFormId.toString(),
        );
      if (!pharmaceuticalForm) {
        throw new Error(
          `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
        );
      }

      const unitMeasure = await this.unitsMeasureRepository.findById(
        medicineVariant?.unitMeasureId.toString(),
      );
      if (!unitMeasure) {
        throw new Error(
          `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
        );
      }

      const batchesStock = await Promise.all(
        medicineStock.batchesStockIds.map(async (id) => {
          const batchStock = await this.batchesStocksRepository.findById(
            id.toString(),
          );
          if (!batchStock) {
            throw new Error('lote não identificado');
          }
          const batch = await this.batchesRepository.findById(
            batchStock.batchId.toString(),
          );
          if (!batch) {
            throw new Error('lote não identificado');
          }
          const manufacturer = await this.manufacturersRepository.findById(
            batch.manufacturerId.toString(),
          );
          if (!manufacturer) {
            throw new Error('fabricante não identificado');
          }
          return {
            id: batchStock.id,
            code: batch.code,
            quantity: batchStock.quantity,
            expirationDate: batch.expirationDate,
            manufacturingDate: batch.manufacturingDate,
            manufacturer: manufacturer.content,
            isCloseToExpiration: batch.isCloseToExpiration(),
            isExpired: batch.isExpired(),
          };
        }),
      );

      const medicineStockDetails = MedicineStockDetails.create({
        id: medicineStock.id,
        stock: stock.content,
        stockId: stock.id,
        medicine: medicine.content,
        quantity: {
          totalCurrent: medicineStock.quantity,
          available: batchesStock
            .filter((batch) => !batch.isExpired)
            .reduce((acc, batch) => acc + batch.quantity, 0),
          unavailable: batchesStock
            .filter((batch) => batch.isExpired)
            .reduce((acc, batch) => acc + batch.quantity, 0),
        },
        medicineVariantId: medicineVariant.id,
        dosage: medicineVariant.dosage,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
        createdAt: medicineStock.createdAt,
        updatedAt: medicineStock.updatedAt,
      });
      medicinesStockFiltered.push(medicineStockDetails);
    }
    const medicinesStockPaginatedAndOrdered = medicinesStockFiltered
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10);
    return {
      medicinesStock: medicinesStockPaginatedAndOrdered,
      meta: {
        page,
        totalCount: medicinesStockFiltered.length,
      },
    };
  }

  async fetchAll(): Promise<{ medicinesStock: MedicineStock[] }> {
    const medicinesStock = this.items;

    return {
      medicinesStock,
    };
  }

  async fetchInventory(
    pagination: PaginationParams | null,
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isCloseToExpiring?: boolean;
      isLowStock?: boolean;
    },
  ): Promise<{ inventory: MedicineStockInventory[]; meta: Meta }> {
    const page = pagination?.page ?? 1;
    const perPage = pagination?.perPage ?? 10;
    const { stockId, medicineName, therapeuticClasses, isLowStock } = filters;

    const medicinesStock = this.items;

    const medicinesStockFiltered: MedicineStockInventory[] = [];
    const institution =
      await this.institutionsRepository.findById(institutionId);
    if (!institution) {
      throw new Error(
        `Instituição com Id ${institutionId} não foi encontrado!`,
      );
    }

    let stocksIds = this.stocksRepository.items.reduce((acc, stock) => {
      if (stock.institutionId.equal(new UniqueEntityId(institutionId))) {
        acc.push(stock.id.toString());
      }
      return acc;
    }, [] as string[]);

    if (stockId) {
      const stock = stocksIds.find((item) => item === stockId);
      if (!stock) {
        throw new Error(`Estoque com Id ${stockId} não foi encontrado!`);
      }

      stocksIds = [stock];
    }

    for (const medicineStock of medicinesStock) {
      if (!stocksIds.includes(medicineStock.stockId.toString())) continue;

      const medicine = await this.medicinesRepository.findByMedicineVariantId(
        medicineStock.medicineVariantId.toString(),
      );

      if (!medicine) {
        throw new Error(
          `Medicamento contendo variant id ${medicineStock.medicineVariantId.toString()} não foi encontrado`,
        );
      }

      if (
        !medicine.content
          .toLowerCase()
          .includes(medicineName?.toLowerCase() ?? '')
      ) {
        continue;
      }
      const medicineTherapeuticClassesIdsCasted =
        medicine.therapeuticClassesIds.map((item) => item.toString());

      if (therapeuticClasses) {
        const containstherapeuticClasses = therapeuticClasses.map((item) => {
          if (medicineTherapeuticClassesIdsCasted.includes(item)) {
            return true;
          }
          return false;
        });

        if (!containstherapeuticClasses.includes(true)) continue;
      }

      const medicineVariant = await this.medicinesVariantsRepository.findById(
        medicineStock.medicineVariantId.toString(),
      );

      if (!medicineVariant) {
        throw new Error(
          `Variante de medicamento com id ${medicineStock.medicineVariantId.toString()} não foi encontrada`,
        );
      }

      const pharmaceuticalForm =
        await this.pharmaceuticalFormsRepository.findById(
          medicineVariant?.pharmaceuticalFormId.toString(),
        );
      if (!pharmaceuticalForm) {
        throw new Error(
          `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
        );
      }

      const unitMeasure = await this.unitsMeasureRepository.findById(
        medicineVariant?.unitMeasureId.toString(),
      );
      if (!unitMeasure) {
        throw new Error(
          `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
        );
      }

      const batchesStock = await Promise.all(
        medicineStock.batchesStockIds.map(async (id) => {
          const batchStock = await this.batchesStocksRepository.findById(
            id.toString(),
          );
          if (!batchStock) {
            throw new Error('lote não identificado');
          }
          const batch = await this.batchesRepository.findById(
            batchStock.batchId.toString(),
          );
          if (!batch) {
            throw new Error('lote não identificado');
          }
          const manufacturer = await this.manufacturersRepository.findById(
            batch.manufacturerId.toString(),
          );
          if (!manufacturer) {
            throw new Error('fabricante não identificado');
          }
          return {
            id: batchStock.id,
            code: batch.code,
            quantity: batchStock.quantity,
            expirationDate: batch.expirationDate,
            manufacturingDate: batch.manufacturingDate,
            manufacturer: manufacturer.content,
            isCloseToExpiration: batch.isCloseToExpiration(),
            isExpired: batch.isExpired(),
          };
        }),
      );

      const medicineStockInventory = MedicineStockInventory.create({
        stockId: medicineStock.stockId,
        unitMeasure: unitMeasure.acronym,
        medicine: medicine.content,
        pharmaceuticalForm: pharmaceuticalForm.content,
        medicineVariantId: medicineVariant.id,
        medicineStockId: medicineStock.id,
        dosage: medicineVariant.dosage,
        minimumLevel: medicineStock.minimumLevel,
        quantity: {
          current: medicineStock.quantity,
          available: batchesStock
            .filter((batch) => !batch.isExpired)
            .reduce((acc, batch) => acc + batch.quantity, 0),
          unavailable: batchesStock
            .filter((batch) => batch.isExpired)
            .reduce((acc, batch) => acc + batch.quantity, 0),
        },
        batchesStockIds: medicineStock.batchesStockIds,
      });

      if (
        isLowStock &&
        !medicineStockInventory.isLowStock(medicineStock.minimumLevel)
      ) {
        continue;
      }

      medicinesStockFiltered.push(medicineStockInventory);
    }
    const medicinesStockPaginatedAndOrdered = pagination
      ? medicinesStockFiltered.slice((page - 1) * perPage, page * perPage)
      : medicinesStockFiltered;

    return {
      inventory: medicinesStockPaginatedAndOrdered,
      meta: {
        page,
        totalCount: medicinesStockFiltered.length,
      },
    };
  }

  async getInventoryByMedicineStockId(
    medicineStockid: string,
  ): Promise<MedicineStockInventoryDetails> {
    const medicineStock = await this.findById(medicineStockid);
    if (!medicineStock) {
      throw new Error(
        `Estoque de Medicamento com id "${medicineStockid}" não foi encontrado!`,
      );
    }

    const medicineVariant = await this.medicinesVariantsRepository.findById(
      medicineStock.medicineVariantId.toString(),
    );
    if (!medicineVariant) {
      throw new Error(
        `Variante de medicamento com id "${medicineStock.medicineVariantId.toString()}" não foi encontrada!`,
      );
    }

    const medicine = await this.medicinesRepository.findById(
      medicineVariant.medicineId.toString(),
    );
    if (!medicine) {
      throw new Error(
        `Medicamento com id "${medicineVariant.medicineId.toString()}" não foi encontrado!`,
      );
    }

    const pharmaceuticalForm =
      await this.pharmaceuticalFormsRepository.findById(
        medicineVariant?.pharmaceuticalFormId.toString(),
      );
    if (!pharmaceuticalForm) {
      throw new Error(
        `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
      );
    }

    const unitMeasure = await this.unitsMeasureRepository.findById(
      medicineVariant?.unitMeasureId.toString(),
    );
    if (!unitMeasure) {
      throw new Error(
        `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
      );
    }

    const batchesStock = await Promise.all(
      medicineStock.batchesStockIds.map(async (id) => {
        const batchStock = await this.batchesStocksRepository.findById(
          id.toString(),
        );
        if (!batchStock) {
          throw new Error('lote não identificado');
        }

        const batch = await this.batchesRepository.findById(
          batchStock.batchId.toString(),
        );
        if (!batch) {
          throw new Error('lote não identificado');
        }

        const manufacturer = await this.manufacturersRepository.findById(
          batch.manufacturerId.toString(),
        );
        if (!manufacturer) {
          throw new Error('fabricante não identificado');
        }

        return {
          id: batchStock.id,
          code: batch.code,
          quantity: batchStock.quantity,
          expirationDate: batch.expirationDate,
          manufacturingDate: batch.manufacturingDate,
          manufacturer: manufacturer.content,
          isCloseToExpiration: batch.isCloseToExpiration(),
          isExpired: batch.isExpired(),
        };
      }),
    );

    return MedicineStockInventoryDetails.create({
      medicineStockId: medicineStock.id,
      minimumLevel: medicineStock.minimumLevel,
      stockId: medicineStock.stockId,
      dosage: medicineVariant.dosage,
      medicine: medicine.content,
      pharmaceuticalForm: pharmaceuticalForm.content,
      unitMeasure: unitMeasure.acronym,
      batchesStock,
      quantity: {
        available: 0,
        totalCurrent: 0,
        unavailable: 0,
      },
    });
  }

  async getInventoryMetrics(institutionId: string): Promise<{
    quantity: {
      totalCurrent: number;
      available: number;
      unavailable: number;
      zero: number;
      expired: number;
    };
  }> {
    const institution =
      await this.institutionsRepository.findById(institutionId);
    if (!institution) {
      throw new Error(
        `Instituição com Id ${institutionId} não foi encontrada!`,
      );
    }

    const medicinesStock = await this.fetchInventory(
      { page: 1 },
      institutionId,
      {},
    );
    return {
      quantity: {
        totalCurrent: this.items.reduce(
          (acc, item) => acc + (item ? item.quantity : 0),
          0,
        ),
        available: medicinesStock.inventory.reduce(
          (acc, item) => acc + item.quantity.available,
          0,
        ),
        unavailable: medicinesStock.inventory.reduce(
          (acc, item) => acc + item.quantity.unavailable,
          0,
        ),
        zero: medicinesStock.inventory.filter((item) => item.isZero()).length,
        expired: medicinesStock.inventory.filter(
          (item) => item.quantity.unavailable > 0,
        ).length,
      },
    };
  }

  async stockIsZero(stockId: string): Promise<boolean> {
    const medicinesStock = this.items.filter(
      (item) => item.quantity > 0 && item.stockId.toString() === stockId,
    );
    return medicinesStock.length === 0;
  }

  async fetchInventoryReportGrouped(
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isLowStock?: boolean;
    },
    options?: {
      includeBatches?: boolean;
    },
  ): Promise<{
    stocks: Array<{
      stockId: string;
      stock: string;
      medicines: Array<{
        medicineId: string;
        medicine: string;
        medicineStocks: Array<{
          medicineStockId: string;
          medicineVariantId: string;
          pharmaceuticalForm: string;
          unitMeasure: string;
          dosage: string;
          complement?: string;
          minimumLevel: number;
          quantity: { current: number; available: number; unavailable: number };
          batchesStocks?: Array<{
            id: string;
            code: string;
            currentQuantity: number;
            manufacturer: string;
            expirationDate: Date;
            manufacturingDate: Date | null;
            isCloseToExpiration: boolean;
            isExpired: boolean;
          }>;
        }>;
      }>;
    }>;
    meta: Meta;
  }> {
    const includeBatches = options?.includeBatches ?? false;
    const { stockId, medicineName, therapeuticClasses, isLowStock } = filters;

    const institution = await this.institutionsRepository.findById(institutionId);
    if (!institution) {
      throw new Error(`Instituição com Id ${institutionId} não foi encontrado!`);
    }

    const stocksIds = this.stocksRepository.items
      .filter((s) => s.institutionId.equal(institution.id))
      .map((s) => s.id.toString())
      .filter((id) => (!stockId ? true : id === stockId));

    const result = new Map<
      string,
      {
        stockId: string;
        stock: string;
        medicines: Map<
          string,
          {
            medicineId: string;
            medicine: string;
            medicineStocks: any[];
          }
        >;
      }
    >();

    for (const ms of this.items) {
      if (!stocksIds.includes(ms.stockId.toString())) continue;

      const med = await this.medicinesRepository.findByMedicineVariantId(
        ms.medicineVariantId.toString(),
      );
      if (!med) continue;
      if (
        !med.content.toLowerCase().includes((medicineName ?? '').toLowerCase())
      )
        continue;

      if (therapeuticClasses) {
        const cls = med.therapeuticClassesIds.map((id) => id.toString());
        if (!therapeuticClasses.some((id) => cls.includes(id))) continue;
      }

      const variant = await this.medicinesVariantsRepository.findById(
        ms.medicineVariantId.toString(),
      );
      if (!variant) continue;
      const pf = await this.pharmaceuticalFormsRepository.findById(
        variant.pharmaceuticalFormId.toString(),
      );
      const um = await this.unitsMeasureRepository.findById(
        variant.unitMeasureId.toString(),
      );
      const stock = this.stocksRepository.items.find((s) =>
        s.id.equal(ms.stockId),
      )!;

      // batches calculation
      let expiredSum = 0;
      let batches: Array<{
        id: string;
        code: string;
        currentQuantity: number;
        manufacturer: string;
        expirationDate: Date;
        manufacturingDate: Date | null;
        isCloseToExpiration: boolean;
        isExpired: boolean;
      }> | undefined = undefined;

      const bsList = await Promise.all(
        ms.batchesStockIds.map((id) => this.batchesStocksRepository.findById(id.toString())),
      );
      const bsResolved = bsList.filter(Boolean);
      if (includeBatches) {
        batches = await Promise.all(
          bsResolved.map(async (bs) => {
            const batch = await this.batchesRepository.findById(
              bs!.batchId.toString(),
            );
            const manufacturer = await this.manufacturersRepository.findById(
              batch!.manufacturerId.toString(),
            );
            const isExpired = batch!.isExpired();
            if (isExpired) expiredSum += bs!.quantity;
            return {
              id: bs!.id.toString(),
              code: batch!.code,
              currentQuantity: bs!.quantity,
              manufacturer: manufacturer!.content,
              expirationDate: batch!.expirationDate,
              manufacturingDate: batch!.manufacturingDate,
              isCloseToExpiration: batch!.isCloseToExpiration(),
              isExpired,
            };
          }),
        );
      } else {
        // compute expired sum without including batches
        for (const bs of bsResolved) {
          const batch = await this.batchesRepository.findById(
            bs!.batchId.toString(),
          );
          if (batch?.isExpired()) expiredSum += bs!.quantity;
        }
      }

      const available = ms.quantity - expiredSum;
      const item = {
        medicineStockId: ms.id.toString(),
        medicineVariantId: variant.id.toString(),
        pharmaceuticalForm: pf!.content,
        unitMeasure: um!.acronym,
        dosage: variant.dosage,
        complement: variant.complement ?? undefined,
        minimumLevel: ms.minimumLevel,
        quantity: {
          current: ms.quantity,
          available,
          unavailable: expiredSum,
        },
        ...(includeBatches ? { batchesStocks: batches } : {}),
      };

      if (isLowStock) {
        if (!(available < ms.minimumLevel && available > 0)) continue;
      }

      const stockKey = stock.id.toString();
      const medicineKey = med.id.toString();
      if (!result.has(stockKey)) {
        result.set(stockKey, {
          stockId: stockKey,
          stock: stock.content,
          medicines: new Map(),
        });
      }
      const stockEntry = result.get(stockKey)!;
      if (!stockEntry.medicines.has(medicineKey)) {
        stockEntry.medicines.set(medicineKey, {
          medicineId: medicineKey,
          medicine: med.content,
          medicineStocks: [],
        });
      }
      stockEntry.medicines.get(medicineKey)!.medicineStocks.push(item);
    }

    const stocks = Array.from(result.values()).map((s) => ({
      stockId: s.stockId,
      stock: s.stock,
      medicines: Array.from(s.medicines.values()),
    }));

    const totalCount = stocks.reduce(
      (acc, s) =>
        acc +
        s.medicines.reduce(
          (acc2, m) => acc2 + m.medicineStocks.length,
          0,
        ),
      0,
    );
    return {
      stocks,
      meta: {
        page: 1,
        totalCount,
      },
    };
  }
}
