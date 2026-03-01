import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

export class PathologyPresenter {
  static toHTTP(pathology: Pathology) {
    return {
      id: pathology.id.toString(),
      code: pathology.code,
      name: pathology.content,
      createdAt: pathology.createdAt,
      updatedAt: pathology.updatedAt,
    }
  }
}
