// Import the required modules
const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
// const fileUpload = require('express-fileupload');

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./server/routes/userRoutes");
const adminRoutes = require("./server/routes/adminRoutes.js");
const routes = require("./server/routes/recipeRoutes.js");
const { register } = require("module");
require("dotenv").config();
const aboutRoutes = require('./server/routes/aboutRoutes.js');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("NepaliCuisineSecure"));
app.use(
  session({
    secret: "NepaliCuisineSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
// app.use(fileUpload());
app.set("layout", "layout/main"); // Set the layout file (without the .ejs extension)
app.set("view engine", "ejs"); // Set EJS as the view engine
// Set the views directory to './views'
app.set("views", path.join(__dirname, "views"));
// app.set('views','./views/users')


app.use("/", routes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use('/about', aboutRoutes);

// This route handler is for rendering the 'admin/index.ejs' view
app.get("/", (req, res) => {
  res.render("admin/login", { title: "Nepali Cuisine" });
});

app.get("/", (req, res) => {
  res.render("users/register", { title: "Nepali Cuisine" });
});
// Assuming you have a route like this in your app


app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}/login`)
);