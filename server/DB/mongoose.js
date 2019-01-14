var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var mongoLocal = 'mongodb://localhost:27017/TodoApp';

mongoose.connect( process.env.MONGODB_URI || mongoLocal, {'useNewUrlParser': true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose 
}

