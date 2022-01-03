//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const md5 = require('md5');
// const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

// made a schema compatible with mongoose encryption, as we are going to use plugin later on.
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
//used the plugin to encrypt  the password field only now when we save it it will ancrypt and will decrypt when we use find method
// //using variable named SECRET inside .env file for the encryption purpose.
// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home")
});

app.get("/login",function(req,res){
  res.render("login")
});

app.get("/register",function(req,res){
  res.render("register")
});

app.get("/logout",function(req,res){
  res.render("home")
});


app.post("/register",function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");;
    }
  });
});
  });
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = (req.body.password);

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===true){
          res.render("secrets")}
          else
          res.render("wrongPassword");
        
    });
}
}
})
});

app.listen(3000,function(){console.log("successfully started on port 3000")});
