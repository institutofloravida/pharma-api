import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UseMedicinesRepository } from '../../repositories/use-medicine-repository'
import { UseMedicine } from '@/domain/pharma/enterprise/entities/use-medicine'
import { UseMedicineAlreadyExistsError } from './_erros/use-medicine-already-exists-erro'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'

interface createMonthlyMedicineUtilizationUseCaseRequest {
  date?: Date;
}

type createMonthlyMedicineUtilizationUseCaseResponse = Either<
  UseMedicineAlreadyExistsError,
  null
>

@Injectable()
export class CreateMonthlyMedicineUtilizationUseCase {
  constructor(
    private useMedicinesRepository: UseMedicinesRepository,
    private medicinesStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    date = new Date(),
  }: createMonthlyMedicineUtilizationUseCaseRequest): Promise<createMonthlyMedicineUtilizationUseCaseResponse> {
    const year = date.getFullYear()
    const month = date.getMonth()

    const { medicinesStock } = await this.medicinesStockRepository.fetchAll()
    for (const medicineStock of medicinesStock) {
      const useMedicineExists =
        await this.useMedicinesRepository.findByMedicineStockIdAndYearAndMonth(
          year,
          month,
          medicineStock.id.toString(),
        )
      if (!useMedicineExists) {
        const useMedicine = UseMedicine.create({
          year,
          month,
          previousBalance: medicineStock.quantity,
          currentBalance: medicineStock.quantity,
          used: 0,
          medicineStockId: medicineStock.id,
          createdAt: new Date(),
        })

        await this.useMedicinesRepository.create(useMedicine)
      }
    }

    return right(null)
  }
}
