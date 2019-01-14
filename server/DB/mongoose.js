var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
<<<<<<< HEAD

mongoose.connect('mongodb://<USER>:<PASSWORD>@ds129593.mlab.com:29593/todoapp' || 'mongodb://localhost:27017/TodoApp' );
=======
mongoose.connect('mongodb://<USER>:<PASSWORD>!@ds129593.mlab.com:29593/todoapp' || 'mongodb://localhost:27017/TodoApp');
>>>>>>> 87e903f8f45b57654d03a9117bb0bb9f68568ae1

module.exports = {
    mongoose 
}
