const mongoose = require('mongoose');
const Follow = require('../models/follows.model');
const User = require('../models/users.model');

module.exports = {
  findAll: async (req, res) => {
    try {
      await Follow.find({}, function (err, follows) {
        res.json(follows)
      });
    } catch (error) {
      // res.status(400).send(error)
      res.json(error.message)
    }
  },
  createFollow: async (req, res) => {
    const data = { ...req.body }
    const userId = req.userId
    const follow = new Follow({
      _id: new mongoose.Types.ObjectId(),
      follower: data.followerId,
      user: userId
    })

    try {

      await follow.save()

      // Push follower/following to user collection
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { followers: follow._id } }
      );
      await User.findOneAndUpdate(
        { _id: data.followerId },
        { $push: { following: follow._id } }
      );

      return res.json(follow);
    } catch (error) {
      res.json(error.message)
    }
  },
  deleteFollow: async (req, res) => {
    const id = req.params.id
    try {

      const follow = await Follow.findByIdAndRemove(id);

      // Delete follow from users collection
      await User.findOneAndUpdate(
        { _id: follow.user },
        { $pull: { followers: follow._id } }
      );
      await User.findOneAndUpdate(
        { _id: follow.follower },
        { $pull: { following: follow._id } }
      );

      return res.json(follow);
    } catch (error) {
      res.json(error.message)
    }
  }
};