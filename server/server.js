import express  from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";
const app = express();


/* middlewares */

app.use(express.json());
app.use(cors());
app.use(morgan('tiny')); // Logging the HTTP Reqs
app.disable('x-powered-by'); // less hackers know about stack

const port = 8080

/* HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
})

/* api routes */
app.use('/api', router);


/* Start Server */
connect().then(() => {
    try{
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
        
    }
    catch(e){
        console.log("Cannot Connect to the Server!!!")
    }
}
).catch( e => {
    console.log("Error in connecting Database!!!")
});

















/*

npm init -y (to create a serer project)

npm i express cors mongoose mongodb-memory-server multer nodemon

"type" :  "module" to use import 

*/