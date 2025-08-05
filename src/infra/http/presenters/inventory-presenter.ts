import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory';

export class InventoryPresenter {
  static toHTTP(inventory: MedicineStockInventory) {
    return {
      medicineStockId: inventory.medicineStockId.toString(),
      stockId: inventory.stockId.toString(),
      stock: inventory.stock,
      medicine: inventory.medicine,
      complement: inventory.complement,
      medicineVariantId: inventory.medicineVariantId.toString(),
      pharmaceuticalForm: inventory.pharmaceuticalForm,
      unitMeasure: inventory.unitMeasure,
      dosage: inventory.dosage,
      quantity: inventory.quantity,
      bacthesStocks: inventory.batchesStockIds.length,
      isLowStock: inventory.isLowStock(),
      isZero: inventory.isZero(),
    };
  }
}
