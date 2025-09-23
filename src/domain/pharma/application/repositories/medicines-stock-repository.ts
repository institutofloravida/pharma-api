import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicineStock } from '../../enterprise/entities/medicine-stock';
import { MedicineStockDetails } from '../../enterprise/entities/value-objects/medicine-stock-details';
import { Meta } from '@/core/repositories/meta';
import { MedicineStockInventory } from '../../enterprise/entities/medicine-stock-inventory';
import { MedicineStockInventoryDetails } from '../../enterprise/entities/value-objects/medicine-stock-inventory-details';

export abstract class MedicinesStockRepository {
  abstract create(medicinestock: MedicineStock): Promise<void>;
  abstract save(medicinestock: MedicineStock): Promise<void | null>;
  abstract addBatchStock(
    medicineStockId: string,
    batchStockId: string,
  ): Promise<void | null>;
  abstract replenish(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>;
  abstract subtract(
    medicineStockId: string,
    quantity: number,
  ): Promise<MedicineStock | null>;
  abstract findById(id: string): Promise<MedicineStock | null>;
  abstract findByMedicineVariantIdAndStockId(
    medicineVariantId: string,
    stockId: string,
  ): Promise<MedicineStock | null>;
  abstract medicineStockExists(
    medicineStock: MedicineStock,
  ): Promise<MedicineStock | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      stockId?: string;
      medicineVariantId?: string;
      medicineName?: string;
    },
  ): Promise<{ medicinesStock: MedicineStockDetails[]; meta: Meta }>;
  abstract fetchAll(): Promise<{ medicinesStock: MedicineStock[] }>;
  abstract fetchInventory(
    params: PaginationParams,
    institutionId: string,
    filters: {
      stockId?: string;
      medicineName?: string;
      therapeuticClasses?: string[];
      isCloseToExpiring?: boolean;
      isLowStock?: boolean;
      includeZero?: boolean;
    },
  ): Promise<{ inventory: MedicineStockInventory[]; meta: Meta }>;
  abstract getInventoryByMedicineStockId(
    medicineStockid: string,
  ): Promise<MedicineStockInventoryDetails | null>;

  abstract getInventoryMetrics(institutionId: string): Promise<{
    quantity: {
      totalCurrent: number;
      available: number;
      unavailable: number;
      zero: number;
      expired: number;
    };
  }>;

  abstract stockIsZero(stockId: string): Promise<boolean>;
}
