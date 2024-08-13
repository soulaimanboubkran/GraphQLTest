import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
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


export const ProductMutation = extendType({
    type: "Mutation",
    definition(t) {
      // t.nonNull.field("createProduct", {
      //   type: "Product",
      //   args: {
      //     name: nonNull(stringArg()),
      //     price: nonNull(floatArg()),
      //     creatorId: nonNull(floatArg()),
      //   },
      //   resolve(_parent, args, _context, _info): Promise<Product> {
      //     const { name, price, creatorId } = args;
      //     return Product.create({ name, price, creatorId }).save();
      //   },
      // });
  
      t.nonNull.field("createPost", {
        type: "Post",
        args: {
          title: nonNull(stringArg()),
          body: nonNull(stringArg()),
        
        },
        async resolve(_parent, args, context, _info): Promise<Post> {
            const { title, body } = args;
    
            if (!context.user) {
              throw new Error("Not authenticated");
            }
    
            const userId = context.user.userId;
    
            if (!userId) {
              throw new Error("Can't create post without logging in.");
            }
    
            const user = await User.findOne({ where: { id: userId } });
    
            if (!user) {
              throw new Error("User not found.");
            }
    
            const post = Post.create({
              title,
              body,
              author: user, // Set the user instance as the author
            });
    
            return post.save();
          },
        });
    },
  });