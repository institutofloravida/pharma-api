export class ExpiredMedicineDispenseError extends Error {
  constructor(code: string, medicineName: string) {
    super(`The batch ${code} to medicine ${medicineName} is expired.`)
  }
}
