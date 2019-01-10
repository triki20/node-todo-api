const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
    text: 'First test to do'
},{
    text: 'Second test to do'
}];

beforeEach((done) => {
    Todo.remove({}).then( () => {
       return Todo.insertMany(todos);
    }).then(() => done());
});

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

        Todo.find({text}).then((todo) => {
            expect(todo.length).toBe(1);
            expect(todo[0].text).toBe(text);
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
        Todo.find().then((todo) => {
            expect(todo.length).toBe(2);
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