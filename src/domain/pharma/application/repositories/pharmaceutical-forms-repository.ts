import { PharmaceuticalForm } from '../../enterprise/entities/pharmaceutical-form'

export interface PharmaceuticalFormsRepository {
  create(pharmaceuticalForm: PharmaceuticalForm): Promise<void>
  findByContent(content: string): Promise<PharmaceuticalForm | null>
}
