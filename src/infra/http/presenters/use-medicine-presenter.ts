import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'

export class UseMedicinePresenter {
  static toHTTP(useMedicine: UseMedicine) {
    return {
      id: useMedicine.id.toString(),
      name: useMedicine.currentBalance,
      status: useMedicine.previousBalance,
      used: useMedicine.used,
      medicineStockId: useMedicine.medicineStockId.toString(),
      year: useMedicine.year,
      statmonths: useMedicine.month,
      createdAt: useMedicine.createdAt,
    }
  }
}
