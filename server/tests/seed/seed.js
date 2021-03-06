const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {users} = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const Users = [{
    _id: userOneID,
    email: 'yahalom23@gmail.com',
    password: 'userOnepass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userOneID ,access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoID,
    email: 'adi@gmail.com',
    password: 'userTwopass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userTwoID ,access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];



const todos = [{
    _id: new ObjectID(),
    text: 'First test to do',
    _creator: userOneID
},{
    _id: new ObjectID(),
    text: 'Second test to do',
    completed: true,
    completedAt : 333,
    _creator: userTwoID
}];

const populateTodos = (done) => {
    Todo.remove({}).then( () => {
       return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUser = (done) => {
    users.remove({}).then( () => {
        var userOne = new users(Users[0]).save();
        var userTwo = new users(Users[1]).save();

        return Promise.all([userOne,userTwo]);
    }).then(() => done());
};



module.exports = {todos, populateTodos, Users, populateUser};