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
    try {
        let newNotification = await new Notification({
          author: authorId,
          user: userId,
          post: postId,
          [notificationType.toLowerCase()]: notificationTypeId,
        }).save();

        // Push notification to user collection
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: newNotification.id } }
        );

        // Publish notification created event
        newNotification = await newNotification
          .populate('author')
          .populate('follow')
          .populate({ path: 'comment', populate: { path: 'post' } })
          .populate({ path: 'like', populate: { path: 'post' } })
          .execPopulate();
        pubSub.publish(NOTIFICATION_CREATED_OR_DELETED, {
          notificationCreatedOrDeleted: {
            operation: 'CREATE',
            notification: newNotification,
          },
        });
      } catch (err) {
        res.json(err.message)
    }
  }
};