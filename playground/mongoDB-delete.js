const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    // deleteMany
   /* db.collection('Todos').deleteMany({text : "eat lunch"}).then((res) => {
       console.log(res);
    });*/

    //deleteOne
   /* db.collection('Todos').deleteOne({text: 'eat lunch'}).then((res) => {
        console.log(res);
    }); */

    //findOneAndDelete
 /*   db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
        console.log(res);
    }); */

    db.collection('user').deleteMany({name: "Yahalom"}).then((res) => {
        console.log(res);
    });

    db.collection('user').findOneAndDelete({_id: ObjectID("5c31b4ac051bbf488434c6fc")}).then((res) => {
        console.log(res);
    });


    db.close();
});




//text: 'eat lunch',
//completed: false