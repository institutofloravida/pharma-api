import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'

export class TherapeuticClassPresenter {
  static toHTTP(therapeuticClass: TherapeuticClass) {
    return {
      id: therapeuticClass.id.toString(),
      name: therapeuticClass.content,
      createdAt: therapeuticClass.createdAt,
      updatedAt: therapeuticClass.updatedAt,
    }
  }
}
