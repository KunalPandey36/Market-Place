const mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url)

const connection = mongoose.connection;

connection.on('connected' ,()=>{
    console.log("Mongo DB is connected");
})
connection.on('error' ,(err)=>{
    console.log("Mongo DB is not connected");
})

module.exports = connection;

