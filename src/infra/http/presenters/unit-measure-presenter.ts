import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

export class UnitMeasurePresenter {
  static toHTTP(unitmeasure: UnitMeasure) {
    return {
      id: unitmeasure.id.toString(),
      name: unitmeasure.content,
    }
  }
}
