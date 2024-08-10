import { AppDataSource } from '../../src/data-source';
import app from '../../src/app';
import { port } from '../../src/config';
import request from 'supertest';

let server:any;

beforeAll(async () => {
  await AppDataSource.initialize();
    server = app.listen(port);
  });
  

afterAll(async () => {
    await AppDataSource.destroy();
    server.close();
  });
test('should respond with a 200 status code on the base route', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
  });  