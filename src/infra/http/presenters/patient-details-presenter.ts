import { PatientDetails } from '@/domain/pharma/enterprise/entities/value-objects/patient-details'
import { PathologyPresenter } from './pathology-presenter'

export class PatientDetailsPresenter {
  static toHTTP(patient: PatientDetails) {
    return {
      id: patient.patientId.toString(),
      name: patient.name,
      cpf: patient.cpf,
      sus: patient.sus,
      race: patient.race,
      gender: patient.gender,
      birthDate: patient.birthDate,
      age: patient.calculateAge(patient.birthDate),
      generalRegistration: patient.generalRegistration,
      address: {
        ...patient.address,
        id: patient.address.id?.toString(),
      },
      pathologies: patient.pathologies.map(PathologyPresenter.toHTTP),
    }
  }
}
