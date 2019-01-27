const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const{users} = require('./../models/user');
const {todos, populateTodos, Users, populateUser} = require('./seed/seed');

beforeEach(populateUser);
beforeEach(populateTodos);

describe('POST /Todo', () => {
    it('should create a new todo', (done) => {
        var text = 'test the text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

        Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
        }).catch((e) => done(e));
        });   
    });

    it('should not create todo with invalid body data',(done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }
        Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            done()
        }).catch((e) => done(e));
        });
    });
});

describe('GET /Todo', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.length).toBe(2);
        })
        .end(done);
});
});

describe('GET /todos/:id', () => {
    it('should get id todos', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var HexID = new ObjectID().toHexString();
        
        request(app)
        .get(`/todos/${HexID}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var HexID = todos[1]._id.toHexString();

        request(app)
         .delete(`/todos/${HexID}`)
         .expect(200)
         .expect((res) => {
             expect(res.body.todo._id).toBe(HexID);
         })
         .end((err,res) => {
             if(err){
                 return done(err);
             }
             Todo.findById(HexID).then((todo) => {
                 expect(todo).toBeFalsy();
                 done();
             }).catch((e) => done(e));
         });
    });

    it('should return 404 if todo not found', (done) => {
        var HexID = new ObjectID().toHexString();
        
        request(app)
        .delete(`/todos/${HexID}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var HexID = todos[0]._id.toHexString();
        var text = 'bolbol';

        request(app)
        .patch(`/todos/${HexID}`)
        .send({
            text: text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        }).end(done);
    });

   it('should clear completedAt when todo is not completed', (done) => {
    var HexID = todos[1]._id.toHexString();
    var text = 'bolbolzzz';

    request(app)
    .patch(`/todos/${HexID}`)
    .send({
        text: text,
        completed: false
    })
    .expect(200)
    .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
    }).end(done);

   });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', Users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(Users[0]._id.toHexString());
            expect(res.body.email).toBe(Users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123abc';

        request(app)
         .post('/users')
         .send({email,password})
         .expect(200)
         .expect((res) => {
             expect(res.headers['x-auth']).toBeTruthy();
             expect(res.body._id).toBeTruthy();
             expect(res.body.email).toBe(email);
         })
         .end((err) => {
             if(err){
                 return done(err);
             };

             users.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
             });
         });
    })

    it('should return validation errors if request invalid', (done) => {
        var email = 'example.com';
        var password = '12bc';

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done)
    })

    it('should not create user if email in use', (done) => {
        var email = 'adi@gmail.com';

        request(app)
        .post('/users')
        .send({email})
        .expect(400)
        .end(done)
    })
});