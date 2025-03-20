import { UseCaseError } from '@/core/erros/use-case-error'

export class MedicineAlreadyExistsError extends Error implements UseCaseError {
  constructor(medicineName:string) {
    super(`Medicamento "${medicineName}"  já existe!`)
  }
}
