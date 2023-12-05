const express = require("express");
const router = express.Router();
const session = require("express-session");
const auth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/home", auth.isLogin, adminController.loadDashboard);
router.get("/dashboard", adminController.adminDashboard);

router.post("/admin/approve-recipe/:recipeId", adminController.approveRecipe);
router.post("/admin/reject-recipe/:recipeId", adminController.rejectRecipe)

module.exports = router;
