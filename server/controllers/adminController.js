require("../models/database");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { admin: userData });
  } catch (error) {
    console.log("error occured", error);
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
const adminDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 });
    res.render("admin/dashboard", { users: usersData });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

module.exports = {
  loadDashboard,
  logout,
  adminDashboard,
};
