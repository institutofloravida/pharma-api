import { UseCaseError } from '@/core/erros/use-case-error';

export class InsufficientStockForCorrectionError
  extends Error
  implements UseCaseError
{
  constructor(
    batchCode: string,
    available: number,
    requested: number,
  ) {
    super(
      `Estoque insuficiente para corrigir o lote "${batchCode}": disponível ${available}, solicitado reduzir ${requested}.`,
    );
  }
}
