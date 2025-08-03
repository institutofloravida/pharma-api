import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details';

export class MedicineStockDetailsPresenter {
  static toHTTP(medicineStockDetails: MedicineStockDetails) {
    return {
      id: medicineStockDetails.id.toString(),
      stockId: medicineStockDetails.stockId.toString(),
      stock: medicineStockDetails.stock,
      medicineVariantId: medicineStockDetails.medicineVariantId.toString(),
      medicine: medicineStockDetails.medicine,
      pharmaceuticalForm: medicineStockDetails.pharmaceuticalForm,
      unitMeasure: medicineStockDetails.unitMeasure,
      dosage: medicineStockDetails.dosage,
      complement: medicineStockDetails.complement,
      quantity: medicineStockDetails.quantity,
    };
  }
}
