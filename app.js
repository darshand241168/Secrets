//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log("ENCRYPTION KEY: "+process.env.A_SECRET);

userSchema.plugin(encrypt,{secret:process.env.A_SECRET,encryptedFields:["password"]});
const User = mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home");
  });

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register",function(req,res){
    const userName = req.body.username;
    const userPassword = req.body.password;
    const newUser=new User({email:userName,password:userPassword});
    newUser.save().then(function(user) {
        res.render("secrets");
    }).catch(function(err) {
        if (err) {
            console.log("Error adding user");
        } 
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login",function(req,res) {
    const userName = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email:userName}).then(function(user) {
        if (user.password===userPassword) {
            res.render("secrets");
        } else {
            res.render("login");
        }
    }).catch(function(err) {
        if (err) {
            console.log("Error logging in user");
        } 
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

