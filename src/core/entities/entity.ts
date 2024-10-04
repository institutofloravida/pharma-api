import { UniqueEntityId } from "./unique-antity-id";

export abstract class Entity<Props>{
  private _id: UniqueEntityId
  private props: Props

  protected constructor(props: Props, id?: UniqueEntityId){
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }

  get id(){
    return this._id
  }

}