const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node-sql-login'
});

db.connect((err)=>{
    if(err){
        console.log("Error Connecting Database "+err);
    }
    else{
        console.log("DB connected!");
    }
})

app.get("/",(req,res)=>{
    res.send("Hello!!");
})


app.listen("3000",(req,res)=>{
    console.log("Server is on!");
})