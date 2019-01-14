var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<USER>:<PASSWORD>!@ds129593.mlab.com:29593/todoapp' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose 
}
