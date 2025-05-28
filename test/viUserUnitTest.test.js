import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import User from '../app/models/User';
import jwt from 'jsonwebtoken';

describe('App.js User API Tests', () => {
    describe('/POST register', () => {
        it('should register a new user', async () => {
            const userStub = vi.spyOn(User.prototype, 'save').mockResolvedValue({
                _id: '12345',
                username: 'testuser',
                email: 'testuser@example.com',
            });

            const reqBody = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'securePassword123',
            };

            const res = await request(app)
                .post('/register')
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Registration successful');
            expect(res.body).toHaveProperty('token');

            userStub.mockRestore();
        });
    });

    describe('/POST login', () => {
        it('should log in an existing user', async () => {
            const userStub = vi.spyOn(User, 'findOne').mockResolvedValue({
                _id: '12345',
                email: 'testuser@example.com',
                comparePassword: vi.fn().mockResolvedValue(true),
            });

            const jwtStub = vi.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

            const reqBody = {
                email: 'testuser@example.com',
                password: 'securePassword123',
            };

            const res = await request(app)
                .post('/login')
                .send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('token', 'mockedToken');

            userStub.mockRestore();
            jwtStub.mockRestore();
        });

        it('should return an error for invalid credentials', async () => {
            const userStub = vi.spyOn(User, 'findOne').mockResolvedValue(null);

            const reqBody = {
                email: 'invalid@example.com',
                password: 'wrongPassword',
            };

            const res = await request(app)
                .post('/login')
                .send(reqBody);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Invalid email or password');

            userStub.mockRestore();
        });
    });
});
