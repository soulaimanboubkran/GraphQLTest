import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";


export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
      t.nonNull.string("token");
      t.nonNull.field("user", { type: "User" });
    },
  });
export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("register", {
      type: "AuthPayload",
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        age: nonNull(intArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, _context) {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          age: args.age,
          password: hashedPassword,
        });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
        type: "AuthPayload",
        args: {
          firstName: nonNull(stringArg()),
          password: nonNull(stringArg()),
        },
        async resolve(_parent, { firstName, password }, _context) {
          const user = await User.findOne({ where: { firstName } });
          if (!user) {
            throw new Error("No user found with that name");
          }
  
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error("Invalid password");
          }
  
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  
          return {
            token,
            user,
          };
        },
      });
  },
});
