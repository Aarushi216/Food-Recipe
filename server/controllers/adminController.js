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

    // Check if the recipe is found
    if (!recipe) {
      req.flash('error', 'Recipe not found.');
      return res.redirect("/admin/dashboard");
    }

    // Check if the recipe is not already approved
    if (recipe.approvalStatus !== "approved") {
      // Set the approvalStatus to "approved"
      recipe.approvalStatus = "approved";

      // Save the updated recipe
      await recipe.save();

      // Redirect back to the admin dashboard with a success message
      req.flash('success', 'Recipe approved successfully.');
      return res.redirect("/admin/dashboard");
    }

    // If already approved, show a message
    req.flash('info', 'Recipe is already approved.');
    res.redirect("/admin/dashboard");

  } catch (error) {
    console.error('Error approving recipe:', error);
    req.flash('error', 'An error occurred while approving the recipe.');
    res.redirect("/admin/dashboard");
  }
};

const rejectRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe is found
    if (!recipe) {
      req.flash('error', 'Recipe not found.');
      return res.redirect("/admin/dashboard");
    }

    // Check if the recipe is not already rejected
    if (recipe.approvalStatus !== "rejected") {
      // Set the approvalStatus to "rejected"
      recipe.approvalStatus = "rejected";

      // Save the updated recipe
      await recipe.save();

      // Redirect back to the admin dashboard with a success message
      req.flash('success', 'Recipe rejected successfully.');
      return res.redirect("/admin/dashboard");
    }

    // If already rejected, show a message
    req.flash('info', 'Recipe is already rejected.');
    res.redirect("/admin/dashboard");

  } catch (error) {
    console.error('Error rejecting recipe:', error);
    req.flash('error', 'An error occurred while rejecting the recipe.');
    res.redirect("/admin/dashboard");
  }
};




module.exports = {
  loadDashboard,
  logout,
  adminDashboard,
  approveRecipe,
  rejectRecipe
};
