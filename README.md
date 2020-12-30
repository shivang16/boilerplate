## BoilerPlate
This is basic Login and Signup project created with the help of Node.js and MySQL. 
It is hosted on [localhost:3001](localhost:3001)

## Flow
1. User can register with name, email (unique), contact number, and password. 
2. For login additional OTP to the contact number mention, if login credentials are correct.
3. Forget password send an change password link to the registered email.

## Deployment
1. Clone BoilerPlate using [https://github.com/shivang16/boilerplate.git](https://github.com/shivang16/boilerplate.git)
2. run `cd boilerplate` 
3. run `npm install` to install all the dependencies 
4. Incude .env file in this directory.
	.env file must contain:
	 
	`DATABASE = ` -> Database name
	
	`DATABASE_HOST = `	-> Host name
	
	`DATABASE_PASSWORD = ` -> Database password
	
	`DATABASE_USER = ` -> Database username
	
	`JWT_SECRET = ` -> JsonWebToken secret
	
	`JWT_EXPIRES_IN = ` -> JsonWebToken Expiry time limit
	
	`JWT_COOKIE_EXPIRE = ` -> Cookie expire time
	
	`MAIL_USER = ` -> Gmail Id from which you want to send mail on forgot password
	
	`MAIL_PASSWORD = ` -> Password for above Gmail Id.
	
	`NEXMO_API_KEY = ` -> Nexmo API Key.
	
	`NEXMO_API_SECRET = ` -> Nexmo API Secrect.
	
	* Make sure that Gmail Id from which you want to send mail on forgot password has permission to allow non secure apps to access gmail (Using **nodemailer**), [link](https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4NW1MYnRiOLyOf36_EIGK00N5d3Eu4GzB46yhZ06RAnjKydTD2kMFaA0Ho10n47vxJvtmNbB-Yjr_vQja0WrQCUoREdxw)
	* For sending OTP, we are using [Nexmo's](https://developer.nexmo.com/) free trial. Note that OTP will be send only on the number registered in [Nexmo's](https://developer.nexmo.com/) account (as it is trial version).

5. run 	`npm start` to start the project.
6. Go to [localhost:3001](localhost:3001) to see your project. 