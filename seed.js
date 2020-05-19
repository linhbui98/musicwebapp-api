const mongoose = require('mongoose');
const User = require('./models/users.model');
const Post = require('./models/posts.model');
const Song = require('./models/songs.model');
const Follow = require('./models/follows.model');
const Playlist = require('./models/playlists.model');
var config = require('./config').mongodb

var dbUrl = `mongodb://${config.host}:${config.port}/${config.database}`
mongoose.connect(
  dbUrl,
  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false},  
  () => console.log('db connected')
)

const users = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: "linhbui98",
    password: "l9HsllzJdGTmeV+IVS9E/YTVmoI=",
    email: "linhbuiquang@gmail.com",
    fullName: "Bui Quang Linh",
    isActive: true,
    playlists: [],
    followers: [],
    following: [],
    likes: [],
    comments: [],
    posts: [],
    notifications: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: "huybui04",
    password: "l9HsllzJdGTmeV+IVS9E/YTVmoI=",
    email: "huybuiquang@gmail.com",
    fullName: "Bui Quang Huy",
    isActive: true,
    playlists: [],
    followers: [],
    following: [],
    likes: [],
    comments: [],
    posts: [],
    notifications: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: "tungduong98",
    password: "l9HsllzJdGTmeV+IVS9E/YTVmoI=",
    email: "duongnguyentung@gmail.com",
    fullName: "Nguyen Tung Duong",
    isActive: true,
    playlists: [],
    followers: [],
    following: [],
    likes: [],
    comments: [],
    posts: [],
    notifications: []
  }

]

// songs = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 1",
//     source: "source_1"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 2",
//     source: "source_2"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 3",
//     source: "source_3"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 4",
//     source: "source_4"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 5",
//     source: "source_5"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 6",
//     source: "source_6"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 7",
//     source: "source_7"
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Bài hát 8",
//     source: "source_8"
//   }
// ]
// posts = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[0]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[1]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[2]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[0]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[1]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[2]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[0]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[1]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[2]._id,
//     isDelete: false,
//     likes: [],
//     comments: [],
//   }
// ]

// follows = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[0]._id,
//     follower: users[1]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[1]._id,
//     follower: users[0]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     user: users[0]._id,
//     follower: users[2]._id,
//   }
// ]

// const playlists = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 1",
//     user: users[0]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 2",
//     user: users[1]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 3",
//     user: users[2]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 4",
//     user: users[0]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 2",
//     user: users[1]._id,
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     name: "Playlist 3",
//     user: users[2]._id,
//   },
// ] 

User.insertMany(users)
  .then(function (docs) {
    console.log("users", docs)
  })
  .catch(function (err) {
    console.log(err)
  });

// Post.insertMany(posts)
//   .then(function (docs) {
//     console.log("posts", docs)
//   })
//   .catch(function (err) {
//     console.log(err)
//   });

// Song.insertMany(songs)
//   .then(function (docs) {
//     console.log("songs", docs)
//   })
//   .catch(function (err) {
//     console.log(err)
//   });

// Follow.insertMany(follows)
//   .then(function (docs) {
//     console.log("follows", docs)
//   })
//   .catch(function (err) {
//     console.log(err)
//   });

// Playlist.insertMany(playlists)
//   .then(function (docs) {
//     console.log("playlists", docs)
//   })
//   .catch(function (err) {
//     console.log(err)
//   });

