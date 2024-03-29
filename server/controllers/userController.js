require("../models/database");
const express = require("express");
const session = require("express-session");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring=require("randomstring");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//for send mail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "aarushikhanal.076@kathford.edu.np",
        pass: "boik pyhp icjr nnxt",
      },
    });
    const mailOptions = {
      from: "aarushikhanal.076@kathford.edu.np",
      to: email,
      subject: "For Verification mail",
      html: `<p> Hi ${name},Please click here to <a href="http://127.0.0.1:3000/verify?id=${user_id}">Verify</a>Your mail.</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


//for reset password send mail
const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "aarushikhanal.076@kathford.edu.np",
        pass: "boik pyhp icjr nnxt",
      },
    });
    const mailOptions = {
      from: "aarushikhanal.076@kathford.edu.np",
      to: email,
      subject: "For Reset Password",
      html: `<p> Hi ${name},Please click here to <a href="http://127.0.0.1:3000/forget-password?token=${token}">Reset</a>Your password.</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


const loadRegister = async (req, res) => {
  try {
    res.render("users/register", { layout: 'layout/layout-no-header' });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      image: req.file.filename,
      password: spassword,
      mobile: req.body.mno,
      is_admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.render("users/login", {
        message:
          "Your registration has been successfully.Please verify your mail",
      });
    } else {
      res.render("register", { message: "Your registration has been failed." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_varified: 1 } }
    );
    console.log(updateInfo);
    res.render("users/email-verified");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const renderContactUs = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//Login User staretd
const loginLoad = async (req, res) => {
  try {
    
    res.render("users/login", { layout: 'layout/layout-no-header' });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_varified === 0) {
          res.render("users/login", { message: "please verify your mail." });
        } else {
          console.log(userData);
          if (userData.is_admin === 1) {
            return res.redirect("/admin/dashboard");
          }
          req.session.user_id = userData._id;
          
          res.redirect("/");
        }
      } else {
        res.render("users/login", { message: "Credentials are incorrect" });
      }
    } else {
      res.render("login", { message: "Credentials are incorrect" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const loadUserDashboard = async (req, res) => {
  try {
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(401).send({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    const approvalRecipes = await Recipe.find({ approvalStatus: 'approved' });
   
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.render('users/userdashboard', { user, recipes: approvalRecipes });
  } catch (error) {
    console.error('Error loading user dashboard:', error);
    res.status(500).send({ message: 'Error occurred while loading user dashboard' });
  }
};
//forget password code start

const forgetLoad=async(req,res)=>{
  try{
    res.render('users/forget');
  }catch(error){
    console.log(error.message)
  }
};

const forgetVerify=async(req,res)=>{
  try{
    const email=req.body.email;
   const userData=await User.findOne({email:email});
   if(userData){
   
    if(userData.is_varified ===0){
      res.render('users/forget',{message:"please verify your mail"});
    }else{
      const randomString=randomstring.generate();
     const updatedData=await User.updateOne({email:email},{$set:{token:randomString}});
     sendResetPasswordMail(userData.name,userData.email,randomString);
     res.render('users/forget',{message:"Pleasecheck your mail to reset your password"});
    }
   }else{
    res.render('users/forget',{message:"User email is incorrect"});
   }
  }catch(error){
    console.log(error.message);
  }
};
const forgetPasswordLoad=async(req,res)=>{
  try{
    const token = req.query.token;
    const tokenData=await User.findOne({token:token})
    if(tokenData){
      res.render('users/forget-password',{user_id:tokenData._id});
    }else{
      res.render('users/404',{message:"Tokenis invalid"});
    }
  }catch(error){
    console.log(error.message);
  }
};
const resetPassword=async(req,res)=>{
  try{
    const password=req.body.password;
    const user_id=req.body.user_id;

    const secure_password=await securePassword(password);
   const updatedData=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
   res.redirect("/login");
  }catch(error){
    console.log(error.message)
  }
};

//user profile update

const editLoad=async(req,res)=>{
  try{
    const id = req.query.id;
  const userData=await  User.findById({_id:id});
  if(userData){
    res.render("users/edit",{user:userData});
  }else{
    res.redirect("/");
  }
  }catch(error){
    console.log(error.message)
  }
};

const updateProfile=async(req,res)=>{
  try{
    if(req.file){
      const userData=await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}})

    }else{
     const userData=await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
    }
    res.redirect('/')
  }catch(error){
    console.log(error.message)
  }
}

module.exports = {
  loadRegister,
  insertUser,
  verifyMail,
  renderContactUs,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  loadUserDashboard,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  resetPassword,
  editLoad,
  updateProfile
};
