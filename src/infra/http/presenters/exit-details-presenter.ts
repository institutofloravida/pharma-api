import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details';

export class ExitDetailsPresenter {
  static toHTTP(exitDetails: ExitDetails) {
    return {
      id: exitDetails.exitId.toString(),
      exitDate: exitDetails.exitDate,
      exitType: exitDetails.exitType,
      movementType: exitDetails.movementType,
      operator: exitDetails.operator,
      stock: exitDetails.stock,
      destinationInstitution: exitDetails.destinationInstitution,
      responsibleByInstitution: exitDetails.responsibleByInstitution,
      medicines: exitDetails.medicines.map((medicine) => ({
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
