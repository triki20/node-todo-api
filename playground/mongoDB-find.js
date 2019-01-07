//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

   /* db.collection('Todos').find({
        _id: new ObjectID("5c2de075629dd41894447e46")
    }).toArray().then((docs) => {
        console.log('To Dos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unabel to fetch todos', err);
    });*/

    /*db.collection('Todos').find().count().then((count) => {
        console.log(`ToDos count: ${count}`);
    }, (err) => {
        console.log('Unabel to fetch todos', err);
    });*/

    db.collection('user').find({name: 'Yahalom'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unabel to fetch user', err);
    });

    db.close();
});