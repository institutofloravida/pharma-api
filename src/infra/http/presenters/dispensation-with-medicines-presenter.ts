import { DispensationWithMedicines } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-medicines';

export class DispensationWithMedicinesPresenter {
  static toHTTP(dispensation: DispensationWithMedicines) {
    return {
      id: dispensation.dispensationId.toString(),
      dispensationDate: dispensation.dispensationDate,
      patientId: dispensation.patientId.toString(),
      patient: dispensation.patient,
      operatorId: dispensation.operatorId.toString(),
      operator: dispensation.operator,
      items: dispensation.items,
      medicines: dispensation.medicines.map((medicine) => {
        return {
          medicine: medicine.medicine,
          pharmaceuticalForm: medicine.pharmaceuticalForm,
          unitMeasure: medicine.unitMeasure,
          complement: medicine.complement ?? null,
          quantity: medicine.quantity,
          medicineStockId: medicine.medicineStockId.toString(),
          dosage: medicine.dosage, // Ensure dosage is included
        };
      }),
    };
  }
}
