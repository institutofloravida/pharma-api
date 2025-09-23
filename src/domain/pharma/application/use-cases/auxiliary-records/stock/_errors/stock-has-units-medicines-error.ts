import { UseCaseError } from '@/core/erros/use-case-error';

export class StockHasUnitsMedicinesError extends Error implements UseCaseError {
  constructor() {
    super('O estoque precisa estar vazio para ser desativado.');
  }
}
