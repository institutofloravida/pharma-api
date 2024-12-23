import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Patient, type PatientProps } from '@/domain/pharma/enterprise/entities/patient'
import { faker } from '@faker-js/faker'

export function makePatient(
  override: Partial<PatientProps> = {},
  id?: UniqueEntityId,
) {
  const patient = Patient.create({
    name: faker.person.fullName(),
    cpf: faker.string.numeric({ length: 11 }),
    sus: faker.string.numeric({ length: 15 }),
    birthDate: faker.date.past(),
    gender: faker.helpers.arrayElement(['M', 'F', 'O']),
    race: faker.helpers.arrayElement(['black', 'white', 'yellow', 'mixed', 'undeclared', 'indigenous']),
    addressId: new UniqueEntityId(),
    pathologiesIds: [],
    ...override,
  },
  id)

  return patient
}
