import { extendType, objectType } from "nexus";
import { User } from '../entity/User';
import { Post } from '../entity/Post';



export const PostType = objectType({
    name:"Post",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.nonNull.string("body");
       t.nonNull.field("author",{
           type:"User",
           resolve(parent,_args,_context):Promise<User | null>{
         
                return parent.author;
      
           }
       })
      
    },
})

export const PostsQuery = extendType({
    type:"Query",
    definition(t) {
        t.nonNull.list.nonNull.field("posts",{
            type:"Post",
            resolve(_parent, _args, _context, _info):Promise<Post[]>{
                return Post.find({ relations: ["author"] })
            }
        })
    },
})