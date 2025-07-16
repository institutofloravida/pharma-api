import { UseMedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/use-medicine-details'

export class UseMedicinePresenter {
  static toHTTP(useMedicine: UseMedicineDetails) {
    return {
      id: useMedicine.id.toString(),
      currentBalance: useMedicine.currentBalance,
      previousBalance: useMedicine.previousBalance,
      used: useMedicine.used,
      medicineStockId: useMedicine.medicineStockId.toString(),
      year: useMedicine.year,
      month: useMedicine.month,
      medicine: useMedicine.medicine,
      pharmaceuticalForm: useMedicine.pharmaceuticalForm,
      unitMeasure: useMedicine.unitMeasure,
      dosage: useMedicine.dosage,
      complement: useMedicine.complement,
      createdAt: useMedicine.createdAt,
    }
  }
}
