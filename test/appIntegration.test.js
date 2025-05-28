process.env.NODE_ENV = 'test'
let Ticket = require('../app/models/Ticket')
let User = require('../app/models/User');
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app')
let should = chai.should()

chai.use(chaiHttp)

let authToken;

before((done) => {
    let user = new User({
        username: 'gary',
        email: 'gary@oceanpridemedia.com',
        password: '12345678'
    });
    user.save((err, savedUser) => {
        if (err) return done(err);
        chai.request(app)
            .post('/login')
            .send({email: savedUser.email, password: '12345678'})
            .end((err, res) => {
                if (err) return done(err);
                authToken = res.body.token;
                done();
            });
    });
});

after((done) => {
    User.deleteOne({email: 'gary@oceanpridemedia.com'}, (err) => {
        if (err) return done(err);
        done();
    });
});

describe('Tickets', () => {
    // beforeEach((done) => {
    //     Ticket.deleteMany({}, (err) => {
    //         done()
    //     })
    // })//end before each
    describe('/GET ticket', () => {
        it('it should get the tickets list', (done) => {
            chai.request(app)
                .get("/tickets")
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    done()
                })
        })
    })//end get test
    describe('/POST ticket', () => {
        // it('it should not post an ticket', () => {
        //     chai.request(app)
        //     .post("/tickets", () => {
        //     })
        // })//end bad post test
        it("it should post a ticket", (done) => {
            let ticket = new Ticket({
                "name": "test post ticket name",
                "description": "test post ticket description",
                "createdAt": Date.now()
            })
            chai.request(app)
                .post("/tickets")
                .set('Authorization', `Bearer ${authToken}`)
                .send(ticket)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Ticket added successfully')
                    res.body.ticket.should.have.property('name')
                    res.body.ticket.should.have.property('description')
                    res.body.ticket.should.have.property('createdAt')
                    done()
                })
        })
    })
    describe('/GET/:id ticket', () => {
        it('should get a ticket by the given id', (done) => {
            let ticket = new Ticket({
                "name": "test get ticket name",
                "description": "test get ticket description",
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                    .get('/tickets/' + ticket.id)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(ticket)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('name')
                        res.body.should.have.property('description')
                        res.body.should.have.property('createdAt')
                        res.body.should.have.property('_id').eql(ticket.id)
                        done()
                    })
            })
        })
    })// end get id test
    describe('/PUT/:id ticket', () => {
        it('should update an ticket given the id', (done) => {
            let ticket = new Ticket({
                "name": "test put ticket name",
                "description": "test put ticket description",
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                    .put('/tickets/' + ticket.id)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({"description": "put test updated ticket"})
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('Ticket updated')
                        res.body.ticket.should.have.property("description").eql("put test updated ticket")
                        done()
                    })
            })
        })
    })//end put test
    describe('/DELETE/:id ticket', () => {
        it('it should delete an ticket when given an id', (done) => {
            let ticket = new Ticket({
                "name": "test delete ticket name",
                "description": "test delete ticket description",
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                    .delete('/tickets/' + ticket.id)
                    .set('Authorization', `Bearer ${authToken}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property("message").eql("Ticket successfully deleted")
                        done()
                    })
            })
        })
    })
})


