import { MedicineExit } from '../../enterprise/entities/exit'

export abstract class MedicinesExitsRepository {
  abstract create(medicineExit: MedicineExit): Promise<void>
}
