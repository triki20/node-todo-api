const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/DB/mongoose');
const {Todo} = require('./../server/models/todo'); 
const {users} = require('./../server/models/user');
/*
var id = '5c36fa02e8e7f84aaca25fb122';

if(!ObjectID.isValid(id)){
    console.log('ID not Valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('todos' ,todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('todo' ,todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('ID not found')
    }
    console.log('by id' ,todo);
}).catch((e) => console.log(e));
*/

var id = '5c33696cf889700bd0faa2f1222';

users.findById(id).then((user) => {
    if(!user){
       return console.log('USER not found');
    }
    console.log('user name:', user);
}).catch((e) => console.log('holy cropp its dad', e));