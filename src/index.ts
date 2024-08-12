
import { AppDataSource } from "./data-source"

import { port } from "./config"
import { schema } from "./schema";
import { ApolloServer } from "apollo-server";
import dotenv from 'dotenv';


dotenv.config()
const boot = async () => {
    try {
      const conn = await AppDataSource.initialize();
  
      const server = new ApolloServer({
        schema,
      
      
      });
  
      server.listen(port).then(({ url }) => {
        console.log("server running at " + url);
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  boot();