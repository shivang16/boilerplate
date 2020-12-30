const { response } = require('express');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const db = require('../sqlConnect');
const nodemailer = require('nodemailer');


const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  next_event_wait:60,
  workflow_id:4
});


const register = (req,res)=>{

    const {name,email,contact,password,confirmPassword} = req.body;

    db.query("SELECT * FROM users WHERE email=?",[email], async (err,result)=>{
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
                console.log("User Added!");
                return res.redirect('/login')
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

                
                nexmo.verify.request({
                    number: '91'+result[0].contact,
                    brand: 'Node-MYSQL',
                    code_length: '4'
                  }, (err, resultMes) => {
                      if(err){
                          console.log("Error sending the message: "+err)
                      }else{
                            const cookieOptions = {
                                expires: new Date(
                                    Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000
                                ),
                                httpOnly:true
                            }
        
                            res.cookie('request_id',resultMes.request_id,cookieOptions);
                            res.cookie('id',result[0].id,cookieOptions);
                        
                          return res.render('otp')
                      }
                  });


                
            }

        
        });
    }catch(error){
        console.log("Error");
    }
     
}


const otp = async (req,res)=>{
    nexmo.verify.check({
        request_id: req.cookies.request_id,
        code: req.body.otp
      }, async (err, result) => {
        if(err){
            console.log("Error in verification: " + err);
        }else{
                const id = req.cookies.id;

                await res.clearCookie('request_id');
                await res.clearCookie('id');

                if(result.status!=0)
                {
                    return res.status(401).render("login",{
                        message:"Incorrect OTP"
                    })
                }
                
                await res.clearCookie('request_id');
                await res.clearCookie('id');
                

                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                })
                

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

}




const logout = (req,res)=>{
    res.clearCookie('jwt');
    res.redirect('/');
}



const forgotPassword = async (req,res)=>{

    db.query("SELECT * FROM users WHERE email=?",[req.body.email],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(isEmpty(result)){
                return res.status(402).render("register",{
                    message:"Email Not registered"
                })
            }else{
                // Send mail and add reset link
                // in reset link add set new password page.
                
                
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                           user: process.env.MAIL_USER,
                           pass: process.env.MAIL_PASSWORD
                       }
                   });
                
                const mailOptions = {
                    from: process.env.MAIL_USER, // sender address
                    to: result[0].email, // list of receivers
                    subject: 'Subject of your email', // Subject line
                    html: '<p>Your html here</p>'// plain text body
                };   

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err)
                      console.log(err)
                    else
                      console.log(info);
                 });    

                return res.redirect('/register');
            }
        }
    })
}

module.exports = {register,login,logout,forgotPassword,otp};
