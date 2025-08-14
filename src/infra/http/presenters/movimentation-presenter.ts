import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details';

export class MovimentationPresenter {
  static toHTTP(movimentation: MovimentationDetails) {
    return {
      id: movimentation.id,
      direction: movimentation.direction,
      medicine: movimentation.medicine,
      batchCode: movimentation.batchCode,
      complement: movimentation.complement,
      dosage: movimentation.dosage,
      pharmaceuticalForm: movimentation.pharmaceuticalForm,
      unitMeasure: movimentation.unitMeasure,
      stock: movimentation.stock,
      movementDate: movimentation.movementDate,
      movementType:
        movimentation.movementType === 'DISPENSATION'
          ? 'DISPENSA'
          : movimentation.movementType === 'EXPIRATION'
            ? 'VENCIMENTO'
            : movimentation.movementType === 'TRANSFER'
              ? 'TRANSFERÊNCIA'
              : movimentation.movementType === 'DONATION'
                ? 'DOAÇÃO'
                : movimentation.movementType
                  ? movimentation.movementType
                  : 'Desconhecido',
      operator: movimentation.operator,
      quantity: movimentation.quantity,
    };
  }
}
