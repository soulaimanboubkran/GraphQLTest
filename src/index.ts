
import { AppDataSource } from "./data-source"

import app from './app'
import { port } from "./config"


AppDataSource.initialize().then(async () => {

 
    app.listen(port)

 

    console.log(`Open http://localhost:${process.env.PORT}/users`)

}).catch(error => console.log(error))
