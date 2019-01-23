const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
        validator: (val) => {
         return validator.isEmail(val);
        },
         message: '{VALUE} is a not a valid Email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 10,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    
    user.tokens = user.tokens.concat([{access, token}]);

   return user.save().then(() => {
        return token;
    });
};

var users = mongoose.model('Users', UserSchema);

module.exports = {
    users
}