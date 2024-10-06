import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Medicine } from '../../enterprise/entities/medicine'
import type { MedicineRepository } from '../repositories/medicine-repository'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface createMedicineUseCaseRequest {
  content: string,
  description?: string | null
  dosage: string
  pharmaceuticalFormId: UniqueEntityId
  therapeuticClassesIds: UniqueEntityId[]
}
type createMedicineUseCaseResponse = Either<
  ConflictError,
  {
    medicine: Medicine
  }
>
export class CreateMedicineUseCase {
  constructor(private medicineRepository: MedicineRepository) {}
  async execute({
    content,
    dosage,
    description,
    pharmaceuticalFormId,
    therapeuticClassesIds,
  }: createMedicineUseCaseRequest): Promise<createMedicineUseCaseResponse> {
    const medicine = Medicine.create({
      content,
      dosage,
      description,
      pharmaceuticalFormId,
      therapeuticClassesIds,
    })

    const contentExists = await this.medicineRepository.medicineExists(medicine)
    if (contentExists) {
      return left(new ConflictError())
    }

    await this.medicineRepository.create(medicine)

    return right({
      medicine,
    })
  }
}
