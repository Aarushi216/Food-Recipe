const renderAboutPage = (req, res) => {
    // You can fetch additional data from the database or other sources if needed
    res.render('about/aboutPage', { title: 'About Us' });
  };
  
  module.exports = {
    renderAboutPage,
  };