process.env.NODE_ENV = 'test'
let Ticket = require('../app/models/ticket')

let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app')
let should = chai.should()

chai.use(chaiHttp)
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
        it("it should post an ticket", (done) => {
            let ticket = new Ticket({
                "name": "pinkish peckers",
                "description": "big ones",
                "createdAt": Date.now()
            })
            chai.request(app)
            .post("/tickets")
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
        })//end good post test
    })//end post tests
    describe('/GET/:id ticket', () => {
        it('should get a ticket by the given id', (done) => {
            let ticket = new Ticket({
                "name": "farm animal",
                "description": "versatile companion"
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                .get('/tickets/' + ticket.id)
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
                "name": "put test",
                "description": "test ticket",
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                .put('/tickets/' + ticket.id)
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
                "name": "delete test ticket",
                "description": "this ticket is toast",
            })
            ticket.save((err, ticket) => {
                chai.request(app)
                .delete('/tickets/' + ticket.id)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("message").eql("Ticket successfully deleted")
                    res.body.result.should.have.property('ok').eql(1)
                    res.body.result.should.have.property('n').eql(1)
                    done()
                })
            })
        })
    })
})


