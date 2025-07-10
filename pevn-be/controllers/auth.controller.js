const authService = require("../services/auth.service");

const authentication = {
  signUp: async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const result = await authService.signUp({ name, email, password, role });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  },

  signIn: async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const result = await authService.signIn({ email, password, role });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  } 
};

module.exports = authentication;
