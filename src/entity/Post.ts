import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm"
import { User } from "./User"

@Entity()
export class Post  extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    body: string

   @ManyToOne(()=>User,(user)=>user.posts)
   author! : User
}
