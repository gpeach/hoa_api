const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../app/models/User');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

chai.use(chaiHttp);

describe('App.js User API Tests', function () {
    this.timeout(2000); // Increase timeout to 10 seconds

    describe('/POST register', () => {
        it('should register a new user', async () => {
            const userStub = sinon.stub(User.prototype, 'save').resolves({
                _id: '12345',
                username: 'testuser',
                email: 'testuser@example.com',
            });

            const reqBody = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'securePassword123',
            };

            const res = await chai.request(app)
                .post('/register')
                .send(reqBody);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').eql('Registration successful');
            expect(res.body).to.have.property('token');

            userStub.restore();
        });
    });

    describe('/POST login', () => {
        it('should log in an existing user', async () => {
            const userStub = sinon.stub(User, 'findOne').resolves({
                _id: '12345',
                email: 'testuser@example.com',
                comparePassword: sinon.stub().resolves(true),
            });

            const jwtStub = sinon.stub(jwt, 'sign').returns('mockedToken');

            const reqBody = {
                email: 'testuser@example.com',
                password: 'securePassword123',
            };

            const res = await chai.request(app)
                .post('/login')
                .send(reqBody);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').eql('Login successful');
            expect(res.body).to.have.property('token').eql('mockedToken');

            userStub.restore();
            jwtStub.restore();
        });

        it('should return an error for invalid credentials', async () => {
            const userStub = sinon.stub(User, 'findOne').resolves(null);

            const reqBody = {
                email: 'invalid@example.com',
                password: 'wrongPassword',
            };

            const res = await chai.request(app)
                .post('/login')
                .send(reqBody);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error').eql('Invalid email or password');

            userStub.restore();
        });
    });
});
