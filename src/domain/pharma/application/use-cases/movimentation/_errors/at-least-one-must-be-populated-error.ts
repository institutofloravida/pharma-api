export class AtLeastOneMustBePopulatedError extends Error {
  constructor() {
    super('At least one ("batches" or "newBatches") must be populated.')
  }
}
