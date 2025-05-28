import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import Ticket from '../app/models/Ticket';
import jwt from 'jsonwebtoken';

describe('App.js API Tests with Mocked Auth Token', () => {
    let authStub;

    beforeEach(() => {
        // Stub jwt.verify to mock token verification
        authStub = vi.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { _id: '12345', email: 'testuser@example.com' });
        });
    });

    afterEach(() => {
        // Restore the original jwt.verify function
        authStub.mockRestore();
    });

    describe('/GET tickets', () => {
        it('should get the tickets list', async () => {
            const queryStub = {
                exec: vi.fn().mockResolvedValue([
                    { name: 'Ticket 1', description: 'Description 1' },
                    { name: 'Ticket 2', description: 'Description 2' },
                ]),
            };
            const ticketStub = vi.spyOn(Ticket, 'find').mockReturnValue(queryStub);

            const res = await request(app)
                .get('/tickets')
                .set('Authorization', 'Bearer mockedToken');

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(2);

            ticketStub.mockRestore();
        });
    });

    describe('/POST tickets', () => {
        it('should create a new ticket', async () => {
            const ticketStub = vi.spyOn(Ticket.prototype, 'save').mockResolvedValue({
                name: 'Test Ticket',
                description: 'This is a test ticket',
            });

            const reqBody = {
                name: 'Test Ticket',
                description: 'This is a test ticket',
            };

            const res = await request(app)
                .post('/tickets')
                .set('Authorization', 'Bearer mockedToken')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Ticket added successfully');
            expect(res.body.ticket).toHaveProperty('name', 'Test Ticket');

            ticketStub.mockRestore();
        });
    });

    describe('/GET/:id tickets', () => {
        it('should get a ticket by ID', async () => {
            const queryStub = {
                exec: vi.fn().mockResolvedValue({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'This is a test ticket',
                }),
            };

            const ticketStub = vi.spyOn(Ticket, 'findById').mockReturnValue(queryStub);

            const res = await request(app)
                .get('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Test Ticket');

            ticketStub.mockRestore();
        });
    });

    describe('/PUT/:id tickets', () => {
        it('should update a ticket by ID', async () => {
            const queryStub = {
                exec: vi.fn().mockResolvedValue({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'Updated description',
                }),
            };

            const ticketStub = vi.spyOn(Ticket, 'findByIdAndUpdate').mockReturnValue(queryStub);

            const reqBody = { description: 'Updated description' };

            const res = await request(app)
                .put('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Ticket updated');
            expect(res.body.ticket).toHaveProperty('description', 'Updated description');

            ticketStub.mockRestore();
        });
    });

    describe('/DELETE/:id tickets', () => {
        it('should delete a ticket by ID', async () => {
            const queryStub = {
                exec: vi.fn().mockResolvedValue({
                    _id: '12345',
                    name: 'Test Ticket',
                    description: 'This is a test ticket',
                }),
            };

            const ticketStub = vi.spyOn(Ticket, 'findByIdAndDelete').mockReturnValue(queryStub);

            const res = await request(app)
                .delete('/tickets/12345')
                .set('Authorization', 'Bearer mockedToken');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Ticket successfully deleted');

            ticketStub.mockRestore();
        });
    });
});
