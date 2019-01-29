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
        .set('x-auth', Users[0].tokens[0].token)
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
        .set('x-auth', Users[0].tokens[0].token)
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
        .set('x-auth', Users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.length).toBe(1);
        })
        .end(done);
});
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', Users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', Users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var HexID = new ObjectID().toHexString();
        
        request(app)
        .get(`/todos/${HexID}`)
        .set('x-auth', Users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', Users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var HexID = todos[1]._id.toHexString();

        request(app)
         .delete(`/todos/${HexID}`)
         .set('x-auth', Users[1].tokens[0].token)
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

    it('should not remove a todo by other user', (done) => {
        var HexID = todos[0]._id.toHexString();

        request(app)
         .delete(`/todos/${HexID}`)
         .set('x-auth', Users[1].tokens[0].token)
         .expect(404)
         .end((err,res) => {
             if(err){
                 return done(err);
             }
             Todo.findById(HexID).then((todo) => {
                 expect(todo).toBeTruthy();
                 done();
             }).catch((e) => done(e));
         });
    });

    it('should return 404 if todo not found', (done) => {
        var HexID = new ObjectID().toHexString();
        
        request(app)
        .delete(`/todos/${HexID}`)
        .set('x-auth', Users[1].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .set('x-auth', Users[1].tokens[0].token)
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
        .set('x-auth', Users[0].tokens[0].token)
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

    it('should not update the todo by other user', (done) => {
        var HexID = todos[1]._id.toHexString();
        var text = 'bolbol';

        request(app)
        .patch(`/todos/${HexID}`)
        .set('x-auth', Users[0].tokens[0].token)
        .send({
            text: text,
            completed: true
        })
        .expect(404)
        .end(done);
    });

   it('should clear completedAt when todo is not completed', (done) => {
    var HexID = todos[1]._id.toHexString();
    var text = 'bolbolzzz';

    request(app)
    .patch(`/todos/${HexID}`)
    .set('x-auth', Users[1].tokens[0].token)
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
             }).catch((e) => done(e));
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

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
         .post('/users/login')
         .send({
             email: Users[1].email,
             password: Users[1].password
         })
         .expect(200)
         .expect((res) => {
             expect(res.headers['x-auth']).toBeTruthy();
         })
         .end((err,res) => {
             if(err){
                return done(err);
             }

             users.findById(Users[1]._id).then((user) => {
                 expect(user.toObject().tokens[1]).toMatchObject({
                     access: 'auth',
                     token: res.headers['x-auth'] 
                 });
                 done();
             }).catch((e) => done(e));
         });
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: Users[1].email,
            password: 123456
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err,res) => {
            if(err){
               return done(err);
            }

            users.findById(Users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    })
});

describe('DELETE /users/me/token',() => {
    it('should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', Users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            users.findById(Users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));

        });
    });
});