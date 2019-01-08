// Libraries
const express = require('express');
const bodyParser = require('body-parser');

// Local models
var {mongoose} = require('./DB/mongoose');
var {Todo} = require('./models/todo');
var {users} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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


app.listen(3000, () => {
    console.log('Started on port 3000');
});


































