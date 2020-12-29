const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser'); 

var bodyParser = require('body-parser');

const app = express();

dotenv.config({path:'./.env'});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.set('view engine','hbs');

// Parse  URL-encoded bodies (as send by HTML forms)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

db.connect((err)=>{
    if(err){
        console.log("Error Connecting Database "+err);
    }
    else{
        console.log("DB connected!");
    }
})

app.use('/',require('./routes/pages'));
app.use('/auth',require("./routes/auth"));


app.listen("3000",(req,res)=>{
    console.log("Server is on!");
})