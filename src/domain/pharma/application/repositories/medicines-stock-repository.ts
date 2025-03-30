import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineStock } from '../../enterprise/entities/medicine-stock'
import { MedicineStockDetails } from '../../enterprise/entities/value-objects/medicine-stock-details'
import { Meta } from '@/core/repositories/meta'
import type { MedicineStockInventory } from '../../enterprise/entities/medicine-stock-inventory'

export abstract class MedicinesStockRepository {
  abstract create(medicinestock: MedicineStock): Promise<void>
  abstract save(medicinestock: MedicineStock): Promise<void | null>
  abstract addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null>
  abstract replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>
  abstract subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>
  abstract findById(id: string): Promise<MedicineStock | null>
  abstract findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null>
  abstract medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null>
  abstract findMany(
    params: PaginationParams,
    filters: {
      stockId: string;
      medicineName?: string;
    },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }>
  abstract fetchInventory(params: PaginationParams, institutionId: string, filters: {
    stockId?: string
    medicineName?: string
    therapeuticClasses?: string[]
    isCloseToExpiring?: boolean
    isLowStock?: boolean
  }): Promise<{ inventory: MedicineStockInventory[], meta: Meta }>
}
