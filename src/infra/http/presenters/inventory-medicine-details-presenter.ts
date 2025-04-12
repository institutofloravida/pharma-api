import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details'

export class InventoryMedicineDetailsPresenter {
  static toHTTP(medicineInventoryDetails: MedicineStockInventoryDetails) {
    return {
      medicineStockId: medicineInventoryDetails.medicineStockId.toString(),
      medicine: medicineInventoryDetails.medicine,
      dosage: medicineInventoryDetails.dosage,
      minimumLevel: medicineInventoryDetails.minimumLevel,
      pharmaceuticalForm: medicineInventoryDetails.pharmaceuticalForm,
      stockId: medicineInventoryDetails.stockId.toString(),
      totalQuantity: medicineInventoryDetails.totalQuantity(),
      unitMeasure: medicineInventoryDetails.unitMeasure,
      batchesStock: medicineInventoryDetails.batchesStock.map((batch) => {
        return {
          ...batch,
          id: batch.id.toString(),
        }
      }),
      isLowStock: medicineInventoryDetails.isLowStock(),
    }
  }
}
