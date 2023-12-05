require("../models/database");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcryptjs");

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    const pendingRecipes = await Recipe.find({ approvalStatus: "pending" });
  
    res.render("admin/dashboard", { admin: userData, users: userData, recipes: pendingRecipes });
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
    const pendingRecipes = await Recipe.find({ approvalStatus: "pending" });

    res.render("admin/dashboard", { users: usersData, recipes: pendingRecipes });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
const approveRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    recipe.approvalStatus = "approved";
    await recipe.save();

    // Redirect back to the recipe list or a specific page
    res.redirect("/views/recipe.ejs");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

const rejectRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    recipe.approvalStatus = "rejected";
    await recipe.save();

    // Redirect back to the recipe list or a specific page
    res.redirect("/views/recipe.ejs");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

module.exports = {
  loadDashboard,
  logout,
  adminDashboard,
  approveRecipe,
  rejectRecipe
};
