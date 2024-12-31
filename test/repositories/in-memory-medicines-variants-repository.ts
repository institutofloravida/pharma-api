import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesVariantsRepository } from '@/domain/pharma/application/repositories/medicine-variant-repository'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { InMemoryMedicinesRepository } from './in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from './in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from './in-memory-units-measure-repository'
import { Meta } from '@/core/repositories/meta'

export class InMemoryMedicinesVariantsRepository
implements MedicinesVariantsRepository {
  public items: MedicineVariant[] = []

  constructor(
    private medicinesRepository: InMemoryMedicinesRepository,
    private pharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository,
    private unitsMeasureRepository: InMemoryUnitsMeasureRepository,
  ) {}

  async create(medicinevariant: MedicineVariant) {
    this.items.push(medicinevariant)
  }

  async medicineVariantExists(medicinevariant: MedicineVariant) {
    const medicineVariantExists = this.items.find((item) => {
      return medicinevariant.equals(item)
    })

    if (medicineVariantExists) {
      return medicineVariantExists
    }

    return null
  }

  async findById(id: string) {
    const medicineVariant = this.items.find(
      (item) => item.id.toString() === id,
    )
    if (!medicineVariant) {
      return null
    }

    return medicineVariant
  }

  async findManyByMedicineIdWithMedicine(
    medicineId: string,
    { page }: PaginationParams,
    content?: string,
  ): Promise<{
    medicinesVariants: MedicineVariantWithMedicine[];
    meta: Meta;
  }> {
    const medicinesVariantsWithMedicine = this.items
      .filter((item) => item.medicineId.toString() === medicineId)
      .map((medicineVariant) => {
        const medicine = this.medicinesRepository.items.find((medicine) => {
          return medicine.id.equal(medicineVariant.medicineId)
        })

        if (!medicine) {
          throw new Error(
            `Medicine with Id ${medicineVariant.id.toString()} does not exist.`,
          )
        }

        const pharmaceuticalForm =
          this.pharmaceuticalFormsRepository.items.find(
            (pharmaceuticalForm) => {
              return pharmaceuticalForm.id.equal(pharmaceuticalForm.id)
            },
          )

        if (!pharmaceuticalForm) {
          throw new Error(
            `pharmaceuticalForm with Id ${medicineVariant.pharmaceuticalFormId.toString()} does not exist.`,
          )
        }

        const unitMeasure = this.unitsMeasureRepository.items.find(
          (UnitMeasure) => {
            return UnitMeasure.id.equal(UnitMeasure.id)
          },
        )

        if (!unitMeasure) {
          throw new Error(
            `UnitMeasure with Id ${medicineVariant.unitMeasureId.toString()} does not exist.`,
          )
        }

        return MedicineVariantWithMedicine.create({
          dosage: medicineVariant.dosage,
          medicineId: medicineVariant.medicineId,
          medicine: medicine.content,
          pharmaceuticalForm: pharmaceuticalForm.content,
          pharmaceuticalFormId: medicineVariant.pharmaceuticalFormId,
          unitMeasure: unitMeasure.acronym,
          unitMeasureId: medicineVariant.unitMeasureId,
          createdAt: medicineVariant.createdAt,
          updatedAt: medicineVariant.updatedAt,
          medicineVariantId: medicineVariant.id,
        })
      })

    const medicinesVariantsWithMedicineFiltred = medicinesVariantsWithMedicine
      .filter((item) => item.medicine.includes(content ?? ''))
      .slice((page - 1) * 20, page * 20)

    return {
      medicinesVariants: medicinesVariantsWithMedicineFiltred,
      meta: {
        page,
        totalCount: medicinesVariantsWithMedicineFiltred.length,
      },
    }
  }
}
