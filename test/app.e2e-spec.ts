import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Application (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Clear the database before running tests
    const dataSource = app.get(DataSource);
    await dataSource.synchronize(true); // true = drop existing tables
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.destroy();
    await app.close();
  });

  describe('Users', () => {
    let userId: number;

    it('/users (POST) - create user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'John Doe', email: 'john@example.com' })
        .expect(201)
        .then((response) => {
          userId = response.body.id;
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('John Doe');
          expect(response.body.email).toBe('john@example.com');
        });
    });

    it('/users (POST) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Jane Doe', email: 'invalid-email' })
        .expect(400);
    });

    it('/users (POST) - should fail without required fields', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Jane Doe' })
        .expect(400);
    });

    it('/users (GET) - get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/users/:id (GET) - get user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(userId);
          expect(response.body.name).toBe('John Doe');
        });
    });

    it('/users/:id (GET) - should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/99999')
        .expect(404);
    });

    it('/users/:id (PATCH) - update user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ name: 'John Updated' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('John Updated');
          expect(response.body.email).toBe('john@example.com');
        });
    });

    it('/users/:id (PATCH) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ email: 'invalid' })
        .expect(400);
    });

    it('/users/:id (DELETE) - delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe('User deleted successfully');
        });
    });

    it('/users/:id (DELETE) - should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/99999')
        .expect(404);
    });
  });

  describe('Activities', () => {
    let testUserId: number;
    let activityId: number;

    beforeAll(async () => {
      // Create a test user for activities
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'Activity User', email: 'activity@example.com' });
      testUserId = response.body.id;
    });

    it('/activities (POST) - create activity', () => {
      return request(app.getHttpServer())
        .post('/activities')
        .send({
          userId: testUserId,
          type: 'login',
          date: new Date().toISOString(),
          data: 'Test login activity',
        })
        .expect(201)
        .then((response) => {
          activityId = response.body.id;
          expect(response.body).toHaveProperty('id');
          expect(response.body.type).toBe('login');
          expect(response.body.data).toBe('Test login activity');
          expect(response.body.user.id).toBe(testUserId);
        });
    });

    it('/activities (POST) - should fail with invalid type', () => {
      return request(app.getHttpServer())
        .post('/activities')
        .send({
          userId: testUserId,
          type: 'invalid_type',
          date: new Date().toISOString(),
          data: 'Test',
        })
        .expect(400);
    });

    it('/activities (POST) - should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/activities')
        .send({
          userId: 99999,
          type: 'login',
          date: new Date().toISOString(),
          data: 'Test',
        })
        .expect(404);
    });

    it('/activities (POST) - should fail without required fields', () => {
      return request(app.getHttpServer())
        .post('/activities')
        .send({
          userId: testUserId,
          type: 'login',
        })
        .expect(400);
    });

    it('/activities (GET) - get all activities', () => {
      return request(app.getHttpServer())
        .get('/activities')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/activities (GET) - filter by userId', () => {
      return request(app.getHttpServer())
        .get(`/activities?userId=${testUserId}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((activity) => {
            expect(activity.user.id).toBe(testUserId);
          });
        });
    });

    it('/activities (GET) - filter by type', () => {
      return request(app.getHttpServer())
        .get('/activities?type=login')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((activity) => {
            expect(activity.type).toBe('login');
          });
        });
    });

    it('/activities (GET) - filter by userId and type', () => {
      return request(app.getHttpServer())
        .get(`/activities?userId=${testUserId}&type=login`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((activity) => {
            expect(activity.user.id).toBe(testUserId);
            expect(activity.type).toBe('login');
          });
        });
    });

    it('/activities/:id (GET) - get activity by id', () => {
      return request(app.getHttpServer())
        .get(`/activities/${activityId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(activityId);
          expect(response.body.type).toBe('login');
          expect(response.body.user.id).toBe(testUserId);
        });
    });

    it('/activities/:id (GET) - should return 404 for non-existent activity', () => {
      return request(app.getHttpServer())
        .get('/activities/99999')
        .expect(404);
    });

    it('/activities/:id (PATCH) - update activity data', () => {
      return request(app.getHttpServer())
        .patch(`/activities/${activityId}`)
        .send({ data: 'Updated activity data' })
        .expect(200)
        .then((response) => {
          expect(response.body.data).toBe('Updated activity data');
          expect(response.body.type).toBe('login');
        });
    });

    it('/activities/:id (PATCH) - update activity type', () => {
      return request(app.getHttpServer())
        .patch(`/activities/${activityId}`)
        .send({ type: 'logout' })
        .expect(200)
        .then((response) => {
          expect(response.body.type).toBe('logout');
        });
    });

    it('/activities/:id (PATCH) - should fail with invalid type', () => {
      return request(app.getHttpServer())
        .patch(`/activities/${activityId}`)
        .send({ type: 'invalid_type' })
        .expect(400);
    });

    it('/activities/:id (DELETE) - delete activity', () => {
      return request(app.getHttpServer())
        .delete(`/activities/${activityId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe('Activity deleted successfully');
        });
    });

    it('/activities/:id (DELETE) - should return 404 for non-existent activity', () => {
      return request(app.getHttpServer())
        .delete('/activities/99999')
        .expect(404);
    });
  });

  describe('Root', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello Team!');
    });
  });
});
