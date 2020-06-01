const User = require('../models/users.model');

module.exports = {
  searchUsers: async (req, res) => {
    const userId = req.userId;
    const { q } = req.query;
    try {

      const users = await User.find({
        $or: [
          { username: new RegExp(q, 'i') },
          { fullName: new RegExp(q, 'i') },
        ],
        _id: {
          $ne: userId,
        },
      }).limit(5);

      return res.json(users);
    } catch (error) {
      res.json(error.message)
    }
  },
};