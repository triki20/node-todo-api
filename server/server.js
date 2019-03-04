require('./config/config');

// Libraries
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


// Local models
var {mongoose} = require('./DB/mongoose');
var {Todo} = require('./models/todo');
var {users} = require('./models/user');
var {authenticate} = require('./middlewere/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// TODO 

// todo POST
app.post('/todos', authenticate, async (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    try{
        const doc = await todo.save();
        res.send(doc);
    }catch(e){
        res.status(400).send(e);
    }
});

// todo GET
app.get('/todos', authenticate, async (req, res) => {

    try{
        const todo = await Todo.find({
            _creator: req.user._id
        });
        res.send({todo});
    }catch(e){
        res.status(400).send(e)
    }
});

// todo GET findById
app.get('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
      res.status(404).send();
  }

  try{
    const todo = await Todo.findOne({
        _id: id,
        _creator: req.user._id
    });
    if(!todo){
        return res.status(404).send();
    }
    res.status(200).send({todo});
  }catch(e){
    res.status(400).send()
  }
});

// todo DELETE
app.delete('/todos/:id', authenticate, async (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    try{
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }catch(e){
        res.status(400).send();
    }
});

// todo PATCH
app.patch('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    try{
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {$set: body}, {new : true});
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }catch(e){
        res.status(400).send()
    }
});

// USERS

app.post('/users', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email','password']);
        const user = new users(body);
        await  user.save();
        const token = await user.generateAuthToken();

        res.header('x-auth', token).send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email','password']);

        const user = await users.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    }catch(e){
        res.status(400).send()
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try{
        await req.user.removeToken(req.token);
        res.status(200).send();
    }catch(e){
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}