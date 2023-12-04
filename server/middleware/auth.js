const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
    } else {
      res.redirect("/");
    }
    next();
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/index");
    }
    next();
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

module.exports = {
  isLogin,
  isLogout,
};
