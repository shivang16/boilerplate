const { response } = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

dotenv.config({path:'../.env'});
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});


const register = (req,res)=>{

    const {name,email,contact,password,confirmPassword} = req.body;

    db.query("SELECT email FROM users WHERE email=?",[email], async (err,result)=>{
        if(err){
            console.log("Error in registration: "+err)
        }else{
            if(result.length>0){ 
                return res.render('register',{
                    message:"That Email is already in use."
                })   
            }else if(password!=confirmPassword){
                return res.render('register',{
                    message:"Password does not match."
                })
            }
        }

        let hashedPassword = await bcrypt.hash(password,8);
        
        db.query("INSERT INTO users SET ?",{name:name,email:email,contact:contact,password:hashedPassword},(error1,result1)=>{
            if(error1){
                console.log("Error in inserting Data: "+error1);
            }else{
                console.log("User registered!");
                return res.render('login')
            }
        })

    })
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


const login = async (req,res)=>{

    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).render("login",{
                message:"Enter email and password"
            });
        }
        db.query("SELECT * FROM users WHERE email=?",[email], async (error,result)=>{
            if(isEmpty(result)){
                return res.status(402).render("register",{
                    message:"Email Not registered"
                })
            }

            if(!result || !(await bcrypt.compare(password,result[0].password) ) ){
                return res.status(401).render("login",{
                    message:"Password Incorrect"
                })
            }else{
                const id = result[0].id;

                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                })
                
                console.log("The token is: "+ token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000
                    ),
                    httpOnly:true
                }

                res.cookie('jwt',token,cookieOptions);
                res.status(200).redirect("/");
            }

        
        });
    }catch(error){
        console.log("Error");
    }
     
}

module.exports = {register,login};