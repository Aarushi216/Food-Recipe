require("../models/database");
const express = require("express");
const session = require("express-session");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
    
    res.render("userdashboard", { layout: 'layout/layout-no-header' });
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

const userDashboard = async (req, res) => {
  try {
    console.log(req.session.user_id); // Add this line
    const userData =await User.findById({_id:req.session.user_id});
    res.render('users/userdasboard',{users:userData});
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


module.exports = {
  loadRegister,
  insertUser,
  verifyMail,
  renderContactUs,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  userDashboard
 
};
