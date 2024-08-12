import { extendType, objectType } from "nexus";
import { User } from '../entity/User';



export const UserType =  objectType({
    name:"User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.int("age");
        t.nonNull.string("password");

    },
})


export const UsersQuery = extendType({
    type:"Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users",{
            type:"User",
            resolve(_parent, _args, _context, _info):Promise<User[]>{
                return User.find();
            }
        })
    },
})