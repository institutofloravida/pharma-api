import { Patient } from '@/domain/pharma/enterprise/entities/patient'

export class PatientPresenter {
  static toHTTP(patient: Patient) {
    return {
      id: patient.id.toString(),
      name: patient.name,
      cpf: patient.cpf,
      sus: patient.sus,
      race: patient.race,
      gender: patient.gender,
      birthDate: patient.birthDate,
      generalRegistration: patient.generalRegistration,
    }
  }
}
