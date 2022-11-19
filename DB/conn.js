const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log("Connection stabilised");
}).catch((err)=>console.log("Error While Connection"));