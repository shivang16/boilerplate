const express = require('express')
const authController = require('../controllers/auth');
const routes = express.Router()


routes.post("/register",authController.register);

routes.post("/login",authController.login);

module.exports = routes;