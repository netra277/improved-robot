const jwt = require('jsonwebtoken');

const User = require('../models/users')
const { JWT_SECRET } = require('../configuration/config')

signToken = user =>{
  return token =  jwt.sign({
    iss:'d-epos',
    sub: user.id,
    iat: new Date().getDate(),
    exp: new Date().setDate(new Date().getDate() + 1)
  },JWT_SECRET);
}

module.exports = {
    signUp: async(req,res,next) =>{
      console.log('signUp called....');
      const {email, password} =  req.value.body;
      console.log(email);
      //check if there is a user with the same email
      const userFound = await User.findOne({email});
      console.log(userFound);
      if(userFound){ 
         return res.status(403).json({error:'email is already in use'})
        };

      //create a new user
      const newUser = new User({ email, password });
      await newUser.save();
      const token = signToken(newUser);
      //respond with token
      res.json({ token});
    },
    signIn: async(req,res,next)=>{
      const token = signToken(req.user);
      res.status(200).json({token});
    },
    secret: async(req,res,next)=>{
      console.log('Hurray im in secret with authentication');
      res.status(200).json({message:'success'});
    }
}