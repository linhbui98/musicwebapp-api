const mongoose = require('mongoose');
const validator = require('validator');
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    // role_id:{
    //     type: ObjectId,
    //     required: true,
    //     trim: true,
    // },
    // email: {
    //     type: String,
    //     match: /^\S+@\S+\.\S+$/,
    //     required: true,
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //     validate: value => {
    //         if (!validator.isEmail(value)) {
    //             throw new Error({ error: 'Invalid Email address' })
    //         }
    //     }
    // },
    // phone: {
    //     type: String,
    //     match: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    // },
    // updated_at: {
    //     type: Date,
    // },
    // created_at: {
    //     type: Date,
    //     required: true,
    // },
    password: {
        type: String,
        required: true,
        minLength: 3,
    }
});

const Users = mongoose.model('Users', userSchema, 'Users');

module.exports = Users;