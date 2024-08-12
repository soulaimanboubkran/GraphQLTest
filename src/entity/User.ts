import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm"
import { Post } from "./Post"

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
    @Column({nullable:false,default:"1234"})
    password: string
    @OneToMany(()=>Post,(post)=>post.author)
    posts! : Post[]
}
