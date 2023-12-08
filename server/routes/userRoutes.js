// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
router.use(express.static('public'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController");
router.get("/register", auth.isLogout, userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);
router.get("/verify", userController.verifyMail);
router.get("/", auth.isLogout, userController.loginLoad);
router.get("/login", auth.isLogout, userController.loginLoad);


router.post("/login", userController.verifyLogin);
router.get("/contact", userController.renderContactUs);


router.post("/main", auth.isLogout, (req, res) => {
  userController.loadHome(req, res);
});

router.get('/userDashboard', auth.isLogin, userController.loadUserDashboard);




// routes/userRoutes.js
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
