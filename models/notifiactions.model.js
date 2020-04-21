
// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const notificationSchema = Schema(
//   {
//     author: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     post: Schema.Types.ObjectId,
//     like: {
//       type: Schema.Types.ObjectId,
//       ref: 'Like',
//     },
//     follow: {
//       type: Schema.Types.ObjectId,
//       ref: 'Follow',
//     },
//     comment: {
//       type: Schema.Types.ObjectId,
//       ref: 'Comment',
//     },
//     seen: {
//       type: Boolean,
//       default: false,
//     },
//   },
// );

// export default mongoose.model('Notification', notificationSchema, 'notifications');