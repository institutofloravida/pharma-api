import { EntryWithStock } from '@/domain/pharma/enterprise/entities/value-objects/entry-with-stock';

export class MedicineEntryPresenter {
  static toHTTP(entry: EntryWithStock) {
    return {
      entryId: entry.entryId,
      stock: entry.stock,
      entryDate: entry.entryDate,
      nfNumber: entry.nfNumber,
      operator: entry.operator,
      items: entry.items,
    };
  }
}
