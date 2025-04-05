import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesStockRepository } from '@/domain/pharma/application/repositories/medicines-stock-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository'
import { InMemoryMedicinesVariantsRepository } from './in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository'
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory'
import { InMemoryInstitutionsRepository } from './in-memory-institutions-repository'
import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details'
import { InMemoryBatchStocksRepository } from './in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from './in-memory-batches-repository'
import { InMemoryManufacturersRepository } from './in-memory-manufacturers-repository'

export class InMemoryMedicinesStockRepository
implements MedicinesStockRepository {
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

  public items: MedicineStock[] = []

  async create(medicinestock: MedicineStock) {
    this.items.push(medicinestock)
  }

  async save(medicinestock: MedicineStock) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === medicinestock.id.toString(),
    )

    if (index === -1) {
      return null
    }

    this.items[index] = medicinestock
  }

  async addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null> {
    const itemIndex = await this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    )

    if (itemIndex === -1) {
      return null
    }

    const medicineStock = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(medicineStockId)),
    )

    if (!medicineStock) {
      return null
    }

    medicineStock?.addBatchStockId(new UniqueEntityId(batchStockId))
    this.items[itemIndex] = medicineStock
  }

  async replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId)
    if (!medicineStock) {
      return null
    }

    medicineStock.replenish(Number(quantity))
    await this.save(medicineStock)
    return medicineStock
  }

  async subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null> {
    const medicineStock = await this.findById(medicineStockId)
    if (!medicineStock) {
      return null
    }

    medicineStock.subtract(Number(quantity))
    await this.save(medicineStock)
    return medicineStock
  }

  async findById(id: string): Promise<MedicineStock | null> {
    const medicinestock = this.items.find((item) => item.id.toString() === id)
    if (!medicinestock) {
      return null
    }

    return medicinestock
  }

  async findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null> {
    const medicinestock = this.items.find(
      (item) =>
        item.medicineVariantId.toString() === medicineVariantId &&
        item.stockId.toString() === stockId,
    )
    if (!medicinestock) {
      return null
    }

    return medicinestock
  }

  async medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null> {
    const medicineStockExists = this.items.find((item) => {
      return medicineStock.equals(item)
    })

    if (medicineStockExists) {
      return medicineStockExists
    }

    return null
  }

  async findMany(
    { page }: PaginationParams,
    filters: { stockId: string; medicineName?: string },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }> {
    const { stockId, medicineName } = filters

    const medicinesStock = this.items

    const medicinesStockFiltered: MedicineStockDetails[] = []
    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) {
      throw new Error(`Estoque com Id ${stockId} não foi encontrado!`)
    }

    for (const medicineStock of medicinesStock) {
      if (!medicineStock.stockId.equal(new UniqueEntityId(stockId))) continue

      const medicine = await this.medicinesRepository.findByMedicineVariantId(
        medicineStock.medicineVariantId.toString(),
      )

      if (!medicine) {
        throw new Error(
          `Medicamento contendo variant id ${medicineStock.medicineVariantId.toString()} não foi encontrado`,
        )
      }

      if (
        !medicine.content
          .toLowerCase()
          .includes(medicineName?.toLowerCase() ?? '')
      ) {
        continue
      }

      const medicineVariant = await this.medicinesVariantsRepository.findById(
        medicineStock.medicineVariantId.toString(),
      )

      if (!medicineVariant) {
        throw new Error(
          `Variante de medicamento com id ${medicineStock.medicineVariantId.toString()} não foi encontrada`,
        )
      }

      const pharmaceuticalForm =
        await this.pharmaceuticalFormsRepository.findById(
          medicineVariant?.pharmaceuticalFormId.toString(),
        )
      if (!pharmaceuticalForm) {
        throw new Error(
          `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
        )
      }

      const unitMeasure = await this.unitsMeasureRepository.findById(
        medicineVariant?.unitMeasureId.toString(),
      )
      if (!unitMeasure) {
        throw new Error(
          `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
        )
      }

      const medicineStockDetails = MedicineStockDetails.create({
        id: medicineStock.id,
        stock: stock.content,
        stockId: stock.id,
        medicine: medicine.content,
        currentQuantity: medicineStock.quantity,
        medicineVariantId: medicineVariant.id,
        dosage: medicineVariant.dosage,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
        createdAt: medicineStock.createdAt,
        updatedAt: medicineStock.updatedAt,
      })
      medicinesStockFiltered.push(medicineStockDetails)
    }
    const medicinesStockPaginatedAndOrdered = medicinesStockFiltered
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)
    return {
      medicinesStock: medicinesStockPaginatedAndOrdered,
      meta: {
        page,
        totalCount: medicinesStockFiltered.length,
      },
    }
  }

  async fetchInventory(
    { page }: PaginationParams,
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isCloseToExpiring?: boolean;
      isLowStock?: boolean;
    },
  ): Promise<{ inventory: MedicineStockInventory[]; meta: Meta }> {
    const { stockId, medicineName, therapeuticClasses, isLowStock } = filters

    const medicinesStock = this.items

    const medicinesStockFiltered: MedicineStockInventory[] = []
    const institution =
      await this.institutionsRepository.findById(institutionId)
    if (!institution) {
      throw new Error(
        `Instituição com Id ${institutionId} não foi encontrado!`,
      )
    }

    let stocksIds = this.stocksRepository.items.reduce((acc, stock) => {
      if (stock.institutionId.equal(new UniqueEntityId(institutionId))) {
        acc.push(stock.id.toString())
      }
      return acc
    }, [] as string[])

    if (stockId) {
      const stock = stocksIds.find((item) => item === stockId)
      if (!stock) {
        throw new Error(`Estoque com Id ${stockId} não foi encontrado!`)
      }

      stocksIds = [stock]
    }

    for (const medicineStock of medicinesStock) {
      if (!stocksIds.includes(medicineStock.stockId.toString())) continue

      const medicine = await this.medicinesRepository.findByMedicineVariantId(
        medicineStock.medicineVariantId.toString(),
      )

      if (!medicine) {
        throw new Error(
          `Medicamento contendo variant id ${medicineStock.medicineVariantId.toString()} não foi encontrado`,
        )
      }

      if (
        !medicine.content
          .toLowerCase()
          .includes(medicineName?.toLowerCase() ?? '')
      ) {
        continue
      }
      const medicineTherapeuticClassesIdsCasted =
        medicine.therapeuticClassesIds.map((item) => item.toString())

      if (therapeuticClasses) {
        const containstherapeuticClasses = therapeuticClasses.map((item) => {
          if (medicineTherapeuticClassesIdsCasted.includes(item)) {
            return true
          }
          return false
        })

        if (!containstherapeuticClasses.includes(true)) continue
      }

      const medicineVariant = await this.medicinesVariantsRepository.findById(
        medicineStock.medicineVariantId.toString(),
      )

      if (!medicineVariant) {
        throw new Error(
          `Variante de medicamento com id ${medicineStock.medicineVariantId.toString()} não foi encontrada`,
        )
      }

      const pharmaceuticalForm =
        await this.pharmaceuticalFormsRepository.findById(
          medicineVariant?.pharmaceuticalFormId.toString(),
        )
      if (!pharmaceuticalForm) {
        throw new Error(
          `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
        )
      }

      const unitMeasure = await this.unitsMeasureRepository.findById(
        medicineVariant?.unitMeasureId.toString(),
      )
      if (!unitMeasure) {
        throw new Error(
          `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
        )
      }

      const medicineStockInventory = MedicineStockInventory.create({
        stockId: medicineStock.stockId,
        unitMeasure: unitMeasure.acronym,
        pharmaceuticalForm: pharmaceuticalForm.content,
        medicineVariantId: medicineVariant.id,
        medicineStockId: medicineStock.id,
        dosage: medicineVariant.dosage,
        minimumLevel: medicineStock.minimumLevel,
        currentQuantity: medicineStock.quantity,
        batchesStockIds: medicineStock.batchesStockIds,
      })

      if (
        isLowStock &&
        !medicineStockInventory.isLowStock(medicineStock.minimumLevel)
      ) {
        continue
      }

      medicinesStockFiltered.push(medicineStockInventory)
    }
    const medicinesStockPaginatedAndOrdered = medicinesStockFiltered
      // .sort((a, b) => b..getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)

    return {
      inventory: medicinesStockPaginatedAndOrdered,
      meta: {
        page,
        totalCount: medicinesStockFiltered.length,
      },
    }
  }

  async getInventoryByMedicineStockId(
    medicineStockid: string,
  ): Promise<MedicineStockInventoryDetails> {
    const medicineStock = await this.findById(medicineStockid)
    if (!medicineStock) {
      throw new Error(
        `Estoque de Medicamento com id "${medicineStockid}" não foi encontrado!`,
      )
    }

    const medicineVariant = await this.medicinesVariantsRepository.findById(
      medicineStock.medicineVariantId.toString(),
    )
    if (!medicineVariant) {
      throw new Error(
        `Variante de medicamento com id "${medicineStock.medicineVariantId.toString()}" não foi encontrada!`,
      )
    }

    const medicine = await this.medicinesRepository.findById(
      medicineVariant.medicineId.toString(),
    )
    if (!medicine) {
      throw new Error(
        `Medicamento com id "${medicineVariant.medicineId.toString()}" não foi encontrado!`,
      )
    }

    const pharmaceuticalForm =
      await this.pharmaceuticalFormsRepository.findById(
        medicineVariant?.pharmaceuticalFormId.toString(),
      )
    if (!pharmaceuticalForm) {
      throw new Error(
        `forma farmacêutica com id ${medicineVariant.pharmaceuticalFormId} não foi encontrada`,
      )
    }

    const unitMeasure = await this.unitsMeasureRepository.findById(
      medicineVariant?.unitMeasureId.toString(),
    )
    if (!unitMeasure) {
      throw new Error(
        `unidade de medida com id ${medicineVariant.unitMeasureId} não foi encontrada`,
      )
    }

    const batchesStock = await Promise.all(
      medicineStock.batchesStockIds.map(async (id) => {
        const batchStock = await this.batchesStocksRepository.findById(
          id.toString(),
        )
        if (!batchStock) {
          throw new Error('lote não identificado')
        }

        const batch = await this.batchesRepository.findById(
          batchStock.batchId.toString(),
        )
        if (!batch) {
          throw new Error('lote não identificado')
        }

        const manufacturer = await this.manufacturersRepository.findById(
          batch.manufacturerId.toString(),
        )
        if (!manufacturer) {
          throw new Error('fabricante não identificado')
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
        }
      }),
    )

    return MedicineStockInventoryDetails.create({
      medicineStockId: medicineStock.id,
      minimumLevel: medicineStock.minimumLevel,
      stockId: medicineStock.stockId,
      dosage: medicineVariant.dosage,
      medicine: medicine.content,
      pharmaceuticalForm: pharmaceuticalForm.content,
      unitMeasure: unitMeasure.acronym,
      batchesStock,
    })
  }
}
