import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Patient, type PatientProps } from '@/domain/pharma/enterprise/entities/patient'
import { PrismaPatientMapper } from '@/infra/database/prisma/mappers/prisma-patient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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
    race: faker.helpers.arrayElement(['BLACK', 'WHITE', 'YELLOW', 'MIXED', 'UNDECLARED', 'INDIGENOUS']),
    pathologiesIds: [],
    ...override,
  },
  id)

  return patient
}

@Injectable()
export class PatientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPatient(data: Partial<PatientProps> = {}): Promise<Patient> {
    const patient = makePatient({
      ...data,
    })

    await this.prisma.patient.create({
      data: PrismaPatientMapper.toPrisma(patient),
    })

    return patient
  }
}
