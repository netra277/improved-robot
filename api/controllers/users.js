const jwt = require('jsonwebtoken');

const User = require('../models/users')
const config = require('../configuration/config')

signToken = user =>{
  return token =  jwt.sign({
    iss:'d-epos',
    sub: user.id,
    iat: new Date().getDate(),
    exp: new Date().setDate(new Date().getDate() + 1)
  },config.jwtSecretKey);
}

module.exports = {
    signIn: async(req,res,next)=>{
      const token = signToken(req.user);
      res.status(200).json({token});
    },
    createUser: async(req,res,next)=>{

    }
}