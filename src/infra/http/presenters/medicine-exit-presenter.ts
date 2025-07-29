import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details'

export class MedicineExitPresenter {
  static toHTTP(exit: ExitDetails) {
    return {
      id: exit.exitId.toString(),
      exitDate: exit.exitDate,
      operator: exit.operator,
      stock: exit.stock,
      items: exit.items,
    }
  }
}
