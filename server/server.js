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
app.post('/todos' , (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
        console.log('secsses add ', doc.text);
    }, (e) => {
        res.status(400).send(e);
    });
});

// todo GET
app.get('/todos', (req, res) => {
    Todo.find().then((todo) => {
        res.send({todo});
    },
     (e) => {
         res.status(400).send(e)
     });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
      res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
      if(!todo){
          return res.status(404).send();
      }
      res.status(200).send({todo});
  }).catch((e) => res.status(400).send());

});

// todo DELETE
app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

// todo PATCH
app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new : true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

// USERS

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email','password']);
    var user = new users(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email','password']);

    users.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send()
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}