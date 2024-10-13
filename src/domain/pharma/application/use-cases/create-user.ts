import { left, right, type Either } from '@/core/either'

import { User, type Gender, type Race } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/users-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { PathologyRepository } from '../repositories/pathologies-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { UserAlreadyExistsError } from './_errors/user-already-exists-error'

interface createUserUseCaseRequest {
  name: string
  cpf: string
  sus: string
  birthDate: Date
  gender: Gender
  race: Race
  generalRegistration?: string | null
  addressId: string
  pathologiesIds: string[]
}
type createUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private pathologyRepository: PathologyRepository,
  ) {}

  async execute({
    name,
    cpf,
    sus,
    birthDate,
    gender,
    race,
    generalRegistration,
    addressId,
    pathologiesIds,
  }: createUserUseCaseRequest): Promise<createUserUseCaseResponse> {
    const pathologiesCheck = await Promise.all(
      pathologiesIds.map(async (id) => {
        const pathology = await this.pathologyRepository.findById(id)
        return !!pathology
      }),
    )

    if (pathologiesCheck.includes(false)) {
      return left(new ResourceNotFoundError('One or more pathologies not found'))
    }

    const userWithSameCpf = await this.userRepository.findByCpf(cpf)
    const userWithSameSus = await this.userRepository.findBySus(sus)
    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(
        `Alredy exists an user with CPF ${userWithSameCpf.cpf}`,
      ))
    }

    if (userWithSameSus) {
      return left(new UserAlreadyExistsError(
        `Alredy exists an user with SUS card ${userWithSameSus.sus}`,
      ))
    }

    const user = User.create({
      name,
      cpf,
      sus,
      birthDate,
      gender,
      race,
      generalRegistration,
      addressId: new UniqueEntityId(addressId),
      pathologiesIds: pathologiesIds.map(id => new UniqueEntityId(id)),
    })
    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
