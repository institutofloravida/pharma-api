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

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public touch() {
    this.props.updatedAt = new Date()
  }
}
