const mongoose = require('mongoose');
const Stream = require('../models/streams.model');
const User = require('../models/users.model');
const Comment = require('../models/comments.model');

module.exports = {
  record: async (req, res) => {
    const { src, comments } = req.body
    const userId = req.userId
    const stream = new Stream({
      _id: new mongoose.Types.ObjectId(),
      src: src,
      user: userId
    })
    try {

      await stream.save();
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { streams: stream._id } }
      );

      Promise.all(comments.map(comment => {
        const newComment = new Comment({
          _id: new mongoose.Types.ObjectId(),
          content: comment.content,
          created_at: comment.createdAt,
          user: comment.userId,
          stream: stream._id
        })

        return newComment.save()
      })).then(async comments => {
        Promise.all(comments.map(comment => {
          return User.findOneAndUpdate(
            { _id: userId },
            { $push: { comments: comment._id } }
          );
        }))
        Promise.all(comments.map(comment => {
          return Stream.findOneAndUpdate(
            { _id: stream._id },
            { $push: { comments: comment._id } }
          );
        })).then(async () => {
          const result = await Stream.findOne({ _id: stream._id }).populate('comments')
          return res.json(result);
        })
      })
    } catch (error) {
      res.json(error.message)
    }
  },
  getStreams: async (req, res) => {
    const userId = req.userId
    const perPage = 5
    const page = req.query.page || 1
    try {
      const streams = await Stream.find({ user: userId })
        .populate({
          path: 'user',
          select: ['fullName', 'avatar']
        })
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'desc' } },
          populate: {
            path: 'user',
            select: ['fullName', 'avatar']
          }
        })
        .sort({ createdAt: 'desc' })
        .limit(perPage)
        .skip(perPage * (page - 1))
      return res.json(streams);

    } catch (error) {
      res.json(error.message)
    }
  }
}