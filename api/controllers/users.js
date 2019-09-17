const User = require('../models/users')

module.exports = {
    signUp: async(req,res,next) =>{
      console.log('signUp called....');
      const {email, password} =  req.value.body;

      //check if there is a user with the same email
      const userFound = User.findOne({email});
      if(userFound){ 
         return res.status(403).json({error:'email is already in use'})
        };

      //create a new user
      const newUser = new User({ email, password });
      await newUser.save();

      //respond with token
      res.json({ user: 'created'});
    },
    signIn: async(req,res,next)=>{

    },
    secret: async(req,res,next)=>{

    }
}