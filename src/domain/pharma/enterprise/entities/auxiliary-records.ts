import { Entity } from '@/core/entities/entity'

export interface AuxiliaryRecordProps {
  content: string
  createdAt: Date
  updatedAt?: Date | null
}
export abstract class AuxiliaryRecord<Props extends AuxiliaryRecordProps>
  extends Entity<Props> {
  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set content(value: string) {
    this.content = value
    this.touch()
  }

  public touch() {
    this.props.updatedAt = new Date()
  }
}
