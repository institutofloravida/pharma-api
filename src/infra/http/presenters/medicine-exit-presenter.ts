import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import type { MedicineExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-exit-details'

export class MedicineExitPresenter {
  static toHTTP(medicineExit: MedicineExitDetails) {
    let movementType

    switch (medicineExit.exitType) {
      case ExitType.DISPENSATION:
        movementType = 'Dispensa'
        break
      case ExitType.EXPIRATION:
        movementType = 'Vencido'
        break
      default:
        movementType = medicineExit.movementType
    }

    return {
      id: medicineExit.medicineExitId.toString(),
      medicine: medicineExit.medicine.toString(),
      dosage: medicineExit.dosage,
      pharmaceuticalForm: medicineExit.pharmaceuticalForm,
      unitMeasure: medicineExit.unitMeasure,
      batch: medicineExit.batch,
      batchestockId: medicineExit.batchestockId.toString(),
      exitDate: medicineExit.exitDate,
      stock: medicineExit.stock,
      medicineStockId: medicineExit.medicineStockId.toString(),
      movementType,
      operator: medicineExit.operator,
      quantity: medicineExit.quantity,
      createdAt: medicineExit.createdAt,
      updatedAt: medicineExit.updatedAt,
    }
  }
}
