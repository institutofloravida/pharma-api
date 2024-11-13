import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'

export class PharmaceuticalFormPresenter {
  static toHTTP(pharmaceuticalForm: PharmaceuticalForm) {
    return {
      id: pharmaceuticalForm.id.toString(),
      name: pharmaceuticalForm.content,
    }
  }
}
