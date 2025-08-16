import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient';

export class DispensationPresenter {
  static toHTTP(dispensation: DispensationWithPatient) {
    return {
      id: dispensation.dispensationId.toString(),
      dispensationDate: dispensation.dispensationDate,
      patientId: dispensation.patientId.toString(),
      patient: dispensation.patient,
      operatorId: dispensation.operatorId.toString(),
      operator: dispensation.operator,
      items: dispensation.items,
      exitId: dispensation.exitId.toString(),
      reversedAt: dispensation.reversedAt,
    };
  }
}
