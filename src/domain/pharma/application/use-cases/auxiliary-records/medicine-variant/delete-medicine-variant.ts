import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { MedicineVariantHasDependencyError } from './_errors/medicine-variant-has-dependency-error';
import { MedicineVariantNotFoundError } from './_errors/medicine-variant-not-found-error';
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository';
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository';

interface deleteMedicineVariantUseCaseRequest {
  medicineVariantId: string;
}

type deleteMedicineVariantUseCaseResponse = Either<
  ResourceNotFoundError | MedicineVariantHasDependencyError,
  null
>;

@Injectable()
export class DeleteMedicineVariantUseCase {
  constructor(
    private medicineVariantsRepository: MedicinesVariantsRepository,
    private medicinesStocksRepository: MedicinesStockRepository,
  ) {}

  async execute({
    medicineVariantId,
  }: deleteMedicineVariantUseCaseRequest): Promise<deleteMedicineVariantUseCaseResponse> {
    const medicinevariant =
      await this.medicineVariantsRepository.findById(medicineVariantId);
    if (!medicinevariant) {
      return left(new MedicineVariantNotFoundError(medicineVariantId));
    }

    const { medicinesStock, meta } =
      await this.medicinesStocksRepository.findMany(
        { page: 1 },
        { medicineVariantId: medicinevariant.id.toString() },
      );

    console.log('medicinesStock', medicinesStock);
    console.log('meta', meta);
    const medicineVariantHasMedicineStockDependency = meta.totalCount;

    if (medicineVariantHasMedicineStockDependency > 0) {
      return left(new MedicineVariantHasDependencyError());
    }

    await this.medicineVariantsRepository.delete(medicineVariantId);

    return right(null);
  }
}
