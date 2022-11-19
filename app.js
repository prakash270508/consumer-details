const mongoose = require('mongoose')
const cors = require('cors')
const dotenv =require('dotenv')
const express = require('express')
const app = express()

dotenv.config({path : './config.env'})  


//Process 2 for heroku
const PORT = process.env.PORT || 5000


require('./DB/conn')
require('./model/userSchema')


app.use(express.json());

app.use(cors({
    origin:"http://localhost:5000"
    }))

//Linking our router file to route
app.use(require('./router/auth'))

app.get("/", (req, res)=>{
    res.send("Hello World from app")
})

// app.get("/about", (req, res)=>{
//     res.send("Hello about World")
// })

app.get("/contact", (req, res)=>{
    res.send("Hello contact World")
})
app.get("/signup", (req, res)=>{
    res.send("Hello Resistration World")
})
app.get("/signin", (req, res)=>{
    res.send("Hello Login World")
})


//Step 3 Heroku 

if(process.env,NODE_ENV === "production"){
    app.use(express.static("client/build"));
    const path= require("path");
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "client", 'build', 'index.html'))
    })
}


// console.log("Working");

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}` );
})