import { Medicine } from '../../enterprise/entities/medicine'

export abstract class MedicinesRepository {
  abstract create(medicine: Medicine): Promise<void>
  abstract medicineExists(medicine: Medicine): Promise<Medicine | null>
  abstract findById(id:string): Promise<Medicine | null>
}
