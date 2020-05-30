const mongoose = require('mongoose');
const Share = require('../models/shares.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    createShare: async (req, res) => {
        try {

        } catch (error) {
            res.json(error.message)
        }
    },
};