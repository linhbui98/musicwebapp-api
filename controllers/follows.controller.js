const getRandom = require('../common/random');
const mongoose = require('mongoose');
const Follow = require('../models/follows.model');
const User = require('../models/users.model');

module.exports = {
  findAll: async (req, res) => {
    try {
      const follows = await Follow.find({})
      return res.json(follows)
    } catch (error) {
      // res.status(400).send(error)
      res.json(error.message)
    }
  },
  getUserFollows: async (req, res) => {
    const userId = req.params.userId
    try {
      const follows = await Follow.find({ user: userId })
        .populate('user')
        .populate('follower')
      return res.json(follows)
    } catch (error) {
      res.json(error.message)
    }
  },
  getFollowerOfUser: async (req, res) => {
    const userId = req.params.userId
    try {
      const follows = await Follow.find({ follower: userId })
        .populate('user')
        .populate('follower')
      return res.json(follows)
    } catch (error) {
      res.json(error.message)
    }
  },
  createFollow: async (req, res) => {
    const data = { ...req.body }
    const userId = req.userId

    const isFollow = await Follow.findOne({
      user: userId,
      follower: data.followerId
    })
    
    if(isFollow){
      return res.json({ message: 'You are followed this user!' })
    }
    
    const follow = new Follow({
      _id: new mongoose.Types.ObjectId(),
      follower: data.followerId,
      user: userId
    })

    try {
      await follow.save()

      // Push follower/following to user collection
      await User.findOneAndUpdate(
        { _id: data.followerId },
        { $push: { followers: follow._id } }
      );
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { following: follow._id } }
      );

      return res.json(follow);
    } catch (error) {
      res.json(error.message)
    }
  },
  deleteFollow: async (req, res) => {
    const userId = req.userId
    const followerId = req.params.followerId
    try {
      const follow = await Follow.findOneAndRemove({
        user: userId,
        follower: followerId
      });

      // Delete follow from users collection
      await User.findOneAndUpdate(
        { _id: follow.user },
        { $pull: { following: follow._id } }
      );
      await User.findOneAndUpdate(
        { _id: follow.follower },
        { $pull: { followers: follow._id } }
      );

      return res.json(follow);
    } catch (error) {
      res.json(error.message)
    }
  },
  suggestFollow: async (req, res) => {
    const userId = req.userId
    // Find user ids, that current user follows
    const userFollowingAndMe = [];
    try {
      const follows = await Follow.find({ user: userId }, { _id: 0 }).select(
        'follower'
      );
      follows.map(f => userFollowingAndMe.push(f.follower));
      userFollowingAndMe.push(userId);
      const query = {
        isActive: true,
        _id: { $nin: userFollowingAndMe },
      };
      let users = await User.find(query)
        .populate('posts')
        .populate('likes')
        .populate('comments')
        .populate('following')
        .populate('followers')
        .populate('playlists')
      // .populate('notifications')

      if (users.length > 3) {
        users = getRandom(users, 3);
      }
      return res.json(users)
    } catch (error) {
      res.json(error.message)
    }
  },
};