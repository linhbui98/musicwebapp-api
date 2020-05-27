const mongoose = require('mongoose');
const notification = require('../models/notificaiotns.model');

module.exports = {
  findAllForUser: async (req, res) => {
    try {
      const users = await User.find({ isActive: true })
        .populate('posts')
        .populate('likes')
        .populate('comments')
      return res.json(users)
    } catch (error) {
      res.json(error.message)
    }
  },
  createNotification: async (req, res) => {
    const userId = req.userId
    const { authorId, postId }= req.body
    try {
        let newNotification = await new Notification({
          _id: new mongoose.Types.ObjectId(),
          author: authorId,
          user: userId,
          post: postId,
        }).save();

        // Push notification to user collection
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: newNotification._id } }
        );

        // Publish notification created event
        newNotification = await newNotification
          .populate('author')
          .populate('follow')
          .populate({ path: 'comment', populate: { path: 'post' } })
          .populate({ path: 'like', populate: { path: 'post' } })
          .execPopulate();

        return newNotification;
      } catch (err) {
        res.json(err.message)
    }
  }
};