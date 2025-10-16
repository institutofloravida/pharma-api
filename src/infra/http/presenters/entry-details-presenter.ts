import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details';

export class EntryDetailsPresenter {
  static toHTTP(entryDetails: EntryDetails) {
    return {
      id: entryDetails.entryId.toString(),
      entryDate: entryDetails.entryDate,
      entryType: entryDetails.entryType,
      movementType: entryDetails.movementType,
      nfNumber: entryDetails.nfNumber,
      operator: entryDetails.operator,
      stock: entryDetails.stock,
      medicines: entryDetails.medicines.map((medicine) => ({
        medicineStockId: medicine.medicineStockId,
        medicineName: medicine.medicineName,
        dosage: medicine.dosage,
        pharmaceuticalForm: medicine.pharmaceuticalForm,
        unitMeasure: medicine.unitMeasure,
        complement: medicine.complement,
        batches: medicine.batches.map((batch) => ({
          batchNumber: batch.batchNumber,
          manufacturer: batch.manufacturer,
          manufacturingDate: batch.manufacturingDate,
          expirationDate: batch.expirationDate,
          quantity: batch.quantity,
        })),
      })),
    };
  }
}
