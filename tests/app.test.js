const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('returns hello message with ok status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello from self-hosted runner!');
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /health', () => {
  it('returns healthy status with timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('POST /echo', () => {
  it('echoes back the request body', async () => {
    const payload = { name: 'runner-test', value: 42 };
    const res = await request(app).post('/echo').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.echo).toEqual(payload);
  });
});
