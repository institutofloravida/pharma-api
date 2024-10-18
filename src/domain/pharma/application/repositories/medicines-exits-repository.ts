import type { MedicineExit } from '../../enterprise/entities/exit'

export interface MedicinesExitsRepository {
  create(medicineExit: MedicineExit): Promise<void>
}
