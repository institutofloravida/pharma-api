export class AtLeastOneMustBePopulatedError extends Error {
  constructor(message?: string) {
    super(message || 'At least one  must be populated.')
  }
}
