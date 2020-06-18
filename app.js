//jshint esversion:6
const express =require("express");
const ejs =require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const bodyparser =require("body-parser");
const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static( "public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser:true,useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
const secret ="this is my secret";
userSchema.plugin(encrypt,{secret:secret,encryptedFeilds:["password"]});
const User = mongoose.model("User",userSchema);



app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/logout",function(req,res){
  res.redirect("/");
});
app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password= req.body.password;
    User.findOne({email:username},function(err,foundUser){
      if (err) {
        console.log(err);
      }else if (foundUser) {
        if (foundUser.password===password) {
          res.render("secrets");
        }
      }
    })

});














app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
});
