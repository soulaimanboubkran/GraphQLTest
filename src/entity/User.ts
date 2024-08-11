import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Post } from "./Post"

@Entity()
export class User {

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
