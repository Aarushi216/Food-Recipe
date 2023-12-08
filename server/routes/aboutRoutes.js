const express = require('express');
const router = express.Router();

// Import your controllers or define the route logic here

// Example route to render the "About" page
router.get('/', (req, res) => {
  res.render('about/aboutPage', { title: 'About Us' });
});

module.exports = router;