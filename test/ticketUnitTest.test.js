const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Ticket = require('../app/models/Ticket');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

chai.use(chaiHttp);

describe('App.js API Tests with Mocked Auth Token', function () {
    this.timeout(2000); // Increase timeout to 10 seconds

    let authStub;

    beforeEach(() => {
        // Stub jwt.verify to mock token verification
        authStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { _id: '12345', email: 'testuser@example.com' });
        });
    });

    afterEach(() => {
        // Restore the original jwt.verify function
        authStub.restore();
    });

    describe('/GET tickets', () => {
        it('should get the tickets list', async () => {
            const queryStub = {
                exec: sinon.stub().resolves([
                    { name: 'Ticket 1', description: 'Description 1' },
                    { name: 'Ticket 2', description: 'Description 2' },
                ]),
            };
            const ticketStub = sinon.stub(Ticket, 'find').returns(queryStub);

            const res = await chai.request(app)
                .get('/tickets')
                .set('Authorization', 'Bearer mockedToken');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);

            ticketStub.restore();
        });
    });

    describe('/POST tickets', () => {
        it('should create a new ticket', async () => {
            const ticketStub = sinon.stub(Ticket.prototype, 'save').resolves({
                name: 'Test Ticket',
                description: 'This is a test ticket',
            });

            const reqBody = {
                name: 'Test Ticket',
                description: 'This is a test ticket',
            };

            const res = await chai.request(app)
                .post('/tickets')
                .set('Authorization', 'Bearer mockedToken')
                .send(reqBody);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').eql('Ticket added successfully');
            expect(res.body.ticket).to.have.property('name').eql('Test Ticket');

            ticketStub.restore();
        });
    });

    describe('/GET/:id tickets', () => {
        it('should get a ticket by ID', async () => {
            const queryStub = {
                exec: sinon.stub().resolves({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'This is a test ticket',
                }),
            };

            const ticketStub = sinon.stub(Ticket, 'findById').returns(queryStub);

            const res = await chai.request(app)
                .get('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name').eql('Test Ticket');

            ticketStub.restore();
        });
    });

    describe('/PUT/:id tickets', () => {
        it('should update a ticket by ID', async () => {
            const queryStub = {
                exec: sinon.stub().resolves({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'Updated description',
                }),
            };

            const ticketStub = sinon.stub(Ticket, 'findByIdAndUpdate').returns(queryStub);

            const reqBody = { description: 'Updated description' };

            const res = await chai.request(app)
                .put('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken')
                .send(reqBody);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').eql('Ticket updated');
            expect(res.body.ticket).to.have.property('description').eql('Updated description');

            ticketStub.restore();
        });
    });

    describe('/DELETE/:id tickets', () => {
        it('should delete a ticket by ID', async () => {
            const queryStub = {
                exec: sinon.stub().resolves({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'This is a test ticket',
                }),
            };

            const ticketStub = sinon.stub(Ticket, 'findByIdAndDelete').returns(queryStub);

            const res = await chai.request(app)
                .delete('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').eql('Ticket successfully deleted');

            ticketStub.restore();
        });
    });
});
