
import { AppDataSource } from "./data-source"

import app from './app'
import { port } from "./config"
import dotenv from 'dotenv';
import { ApolloServer } from "apollo-server";
import { schema } from './schema';


//AppDataSource.initialize().then(async () => {
//
// 
//    app.listen(port)
//
// 
//
//    console.log(`Open http://localhost:${process.env.PORT}/users`)
//
//}).catch(error => console.log(error))
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