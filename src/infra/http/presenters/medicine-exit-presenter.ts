import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details';

export class MedicineExitPresenter {
  static toHTTP(exit: ExitDetails) {
    return {
      id: exit.exitId.toString(),
      exitDate: exit.exitDate,
      destinationInstitution: exit.destinationInstitution,
      responsibleByInstitution: exit.responsibleByInstitution,
      exitType: exit.exitType,
      operator: exit.operator,
      reverseAt: exit.reverseAt ?? null,
      stock: exit.stock,
      items: exit.items,
    };
  }
}
