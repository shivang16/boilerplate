const { use } = require('bcrypt/promises');
const { Router } = require('express');
const express = require('express')
const routes = express.Router()
const jwt = require('jsonwebtoken');

const db = require('../sqlConnect');


routes.get("/",(req,res)=>{

    const token = req.headers.cookie;
    if(!token) return res.status(401).render('index');

    try {
        const token = req.headers.cookie.slice(4);
        const userId = jwt.verify(token,process.env.JWT_SECRET);

        db.query("SELECT * FROM users WHERE id=?",[userId.id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                return res.status(200).render('index',{
                    message:result[0].name,
                });
            }
        });
    } catch (error) {
        return res.status(401).render('index');
    }
    
    
})

routes.get('/register',(req,res)=>{
    res.render('register');
})


routes.get('/login',(req,res)=>{
    res.render('login');
})

routes.get('/forgotPassword',(req,res)=>{
    res.render('forgotPassword');
})

routes.get('/otp',(req,res)=>{
    res.render('otp');
})


module.exports = routes;