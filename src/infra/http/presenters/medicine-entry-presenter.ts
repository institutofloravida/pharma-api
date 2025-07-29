import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details'

export class MedicineEntryPresenter {
  static toHTTP(entry: EntryDetails) {
    return {
      entryId: entry.entryId,
      stock: entry.stock,
      entryDate: entry.entryDate,
      nfNumber: entry.nfNumber,
      operator: entry.operator,
      items: entry.items,
    }
  }
}
