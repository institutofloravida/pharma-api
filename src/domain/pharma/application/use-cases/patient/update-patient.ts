import { left, right, type Either } from '@/core/either'

import {
  Patient,
  type Gender,
  type Race,
} from '../../../enterprise/entities/patient'
import { PatientsRepository } from '../../repositories/patients-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PathologiesRepository } from '../../repositories/pathologies-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Address } from '@/domain/pharma/enterprise/entities/address'
import { PatientAlreadyExistsError } from './_erros/patient-already-exists-error'
import { AddresssRepository } from '../../repositories/address-repository'
import { PatientNotFoundError } from './_erros/patient-not-found-error'

interface updatePatientUseCaseRequest {
  patientId: string;
  name: string;
  cpf?: string;
  sus: string;
  birthDate: Date;
  gender: Gender;
  race: Race;
  generalRegistration?: string | null;
  addressPatient: {
    street?: string;
    number?: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  pathologiesIds: string[];
}

type updatePatientUseCaseResponse = Either<
  PatientAlreadyExistsError | ResourceNotFoundError,
  {
    patient: Patient;
  }
>

@Injectable()
export class UpdatePatientUseCase {
  constructor(
    private patientRepository: PatientsRepository,
    private pathologyRepository: PathologiesRepository,
    private addressRepository: AddresssRepository,
  ) {}

  async execute({
    patientId,
    name,
    cpf,
    sus,
    birthDate,
    gender,
    race,
    generalRegistration,
    addressPatient,
    pathologiesIds,
  }: updatePatientUseCaseRequest): Promise<updatePatientUseCaseResponse> {
    const patientExists = await this.patientRepository.findById(patientId)
    if (!patientExists) {
      return left(new PatientNotFoundError(patientId))
    }

    const pathologiesCheck = await Promise.all(
      pathologiesIds.map(async (id) => {
        const pathology = await this.pathologyRepository.findById(id)
        return !!pathology
      }),
    )

    if (pathologiesCheck.includes(false)) {
      return left(
        new ResourceNotFoundError('One or more pathologies not found'),
      )
    }

    const patientWithSameCpf = await this.patientRepository.findByCpf(
      cpf || '',
    )
    const patientWithSameSus = await this.patientRepository.findBySus(sus)
    if (
      patientWithSameCpf &&
      !patientWithSameCpf.id.equal(new UniqueEntityId(patientId))
    ) {
      return left(
        new PatientAlreadyExistsError(
          'Já existe um usuário com esse mesmo CPF',
        ),
      )
    }

    if (
      patientWithSameSus &&
      !patientWithSameSus.id.equal(new UniqueEntityId(patientId))
    ) {
      return left(
        new PatientAlreadyExistsError(
          'Já existe um usuário com esse mesmo cartão do SUS',
        ),
      )
    }

    const { city, neighborhood, number, state, street, zipCode, complement } =
      addressPatient

    const address = Address.create({
      city,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    }, patientExists.addressId ?? undefined)

    const patient = Patient.create({
      name,
      cpf,
      sus,
      birthDate,
      gender,
      race,
      generalRegistration,
      addressId: new UniqueEntityId(address.id.toString()),
      pathologiesIds: pathologiesIds.map((id) => new UniqueEntityId(id)),
    }, patientExists.id)

    await Promise.all([
      this.addressRepository.save(address),
      this.patientRepository.save(patient),
      this.patientRepository.savePathologies(patientId, pathologiesIds),
    ])

    return right({
      patient,
    })
  }
}
