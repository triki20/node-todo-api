const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/DB/mongoose');
const {Todo} = require('./../server/models/todo'); 
const {users} = require('./../server/models/user');

Todo.findByIdAndRemove('5c3b4d4bd94b1146d054d98b').then((todo) => {
    console.log(todo);
})