var express = require('express')
var router = express.Router()

var author = require('./authors.route')
var album = require('./albums.route')
var user = require('./users.route')
var post = require('./posts.route')
var follow = require('./follows.route')
var comment = require('./comments.route')
var like = require('./likes.route')
var playlist = require('./playlists.route')
var song = require('./songs.route')
var singer = require('./singers.route')
var post = require('./posts.route')
var share = require('./shares.route')
var genre = require('./genres.route')
var search = require('./searchs.route')

router.use('/users', user)
router.use('/authors', author)
router.use('/albums', album)
router.use('/posts', post)
router.use('/follows', follow)
router.use('/comments', comment)
router.use('/likes', like)
router.use('/playlists', playlist)
router.use('/singers', singer)
router.use('/songs', song)
router.use('/shares', share)
router.use('/genres', genre)
router.use('/search', search)

module.exports = router