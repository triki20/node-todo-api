const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

   /* db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5c330203bd434f1ba71be74f")
    },{
        $set:{
        completed: true
        }
    },{
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    }); */

    db.collection('user').findOneAndUpdate({
        _id: new ObjectID("5c331b2dbd434f1ba71beb0c")
    },{
        $set:{
            name: "Yahalom",
            loc: 'Israel'
        },
        $inc:{
            age: 2
        }
    },{
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });

    db.close();
});