const supertest = require('supertest');
const app = require('../app'); // Ensure this is the correct path to your Express app
const generateTestToken = require('./utils/generateToken');

const request = supertest(app);
const token = generateTestToken();

describe('Tasks API', () => {
    test('GET /api/tasks should return all tasks', async () => {
        const response = await request
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('POST /api/tasks should create a new task', async () => {
        const newTask = {
            name: "Test Task",
            description: "Testing task creation",
            is_completed: false
        };
        const response = await request
            .post('/api/tasks')  // Corrected endpoint
            .set('Authorization', `Bearer ${token}`)
            .send(newTask);
        expect(response.statusCode).toBe(201);
    });
});
