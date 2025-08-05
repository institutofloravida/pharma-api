import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details';

export class InventoryMedicineDetailsPresenter {
  static toHTTP(medicineInventoryDetails: MedicineStockInventoryDetails) {
    return {
      medicineStockId: medicineInventoryDetails.medicineStockId.toString(),
      medicine: medicineInventoryDetails.medicine,
      dosage: medicineInventoryDetails.dosage,
      complement: medicineInventoryDetails.complement,
      minimumLevel: medicineInventoryDetails.minimumLevel,
      pharmaceuticalForm: medicineInventoryDetails.pharmaceuticalForm,
      stockId: medicineInventoryDetails.stockId.toString(),
      stock: medicineInventoryDetails.stock,
      totalQuantity: medicineInventoryDetails.totalQuantity(),
      unitMeasure: medicineInventoryDetails.unitMeasure,
      quantity: medicineInventoryDetails.quantity,
      batchesStock: medicineInventoryDetails.batchesStock.map((batch) => {
        return {
          ...batch,
          id: batch.id.toString(),
        };
      }),
      isLowStock: medicineInventoryDetails.isLowStock(),
    };
  }
}
