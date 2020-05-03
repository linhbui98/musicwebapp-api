const mongoose = require('mongoose');
const crypto = require('crypto')
const validator = require('validator');
const ObjectId = mongoose.Schema.ObjectId;
// var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
    },
    fullName: {
        type: String,
        required: true,
    },
    // role_id:{
    //     type: ObjectId,
    //     required: true,
    //     trim: true,
    // },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    playlists: [
        {
          type: ObjectId,
          ref: 'Playlist',
        },
    ],
    posts: [
        {
          type: ObjectId,
          ref: 'Post',
        },
    ],
    likes: [
        {
            type: ObjectId,
            ref: 'Like',
        },
    ],
    comments: [
        {
            type: ObjectId,
            ref: 'Comment',
        },
    ],
    followers: [
        {
            type: ObjectId,
            ref: 'Follow',
        },
    ],
    following: [
        {
            type: ObjectId,
            ref: 'Follow',
        },
    ],
    notifications: [
        {
            type: ObjectId,
            ref: 'Notification',
        },
    ],
});


// Hashes the users password when saving it to DB
userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash password
    const hashPassword = crypto.createHash('sha1').update(user.password).digest('base64')
    user.password = hashPassword;
    next();
});


// Comparre password
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

// userSchema.statics.findByCredentials = async (username, password) => {
//     // Search for a user by email and password. 
//     const user = await User.findOne({ username: username }).exec()
//     if (!user) {
//         throw new Error('Invalid user!')
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password)
//     if (!isPasswordMatch) {
//         throw new Error('Invalid user or password!')
//     }
//     return user
// }

// // Hashes the users password when saving it to DB
// userSchema.pre('save', function(next) {
//     const user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);

//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

const User = mongoose.model('User', userSchema, 'users')
module.exports = User
