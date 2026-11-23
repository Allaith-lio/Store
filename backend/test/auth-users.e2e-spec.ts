import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('Authentication and profile endpoints (e2e)', () => {
  let app: INestApplication<App>;

  const authService = {
    register: jest.fn().mockResolvedValue({
      accessToken: 'register-token',
      user: { id: 'user-1', email: 'laith@example.com' },
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'login-token',
      user: { id: 'user-1', email: 'laith@example.com' },
    }),
  };

  const address = {
    _id: '507f1f77bcf86cd799439011',
    recipientName: 'Laith',
    phone: '123456789',
    street: 'Main Street',
    city: 'Amman',
    country: 'Jordan',
    isDefault: true,
  };

  const usersService = {
    findById: jest.fn().mockResolvedValue({
      id: 'user-1',
      email: 'laith@example.com',
      profile: { firstName: 'Laith' },
    }),
    updateProfile: jest.fn().mockResolvedValue({
      id: 'user-1',
      email: 'laith@example.com',
      profile: { firstName: 'Updated', phone: '123456789' },
    }),
    getAddresses: jest.fn().mockResolvedValue([address]),
    addAddress: jest.fn().mockResolvedValue(address),
    updateAddress: jest.fn().mockResolvedValue({
      ...address,
      street: 'Updated Street',
    }),
    deleteAddress: jest
      .fn()
      .mockResolvedValue({ message: 'Address deleted successfully' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, UsersController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: { switchToHttp: () => { getRequest: () => object } }) => {
          const request = context.switchToHttp().getRequest();
          Object.assign(request, {
            user: { sub: 'user-1', email: 'laith@example.com', role: 'customer' },
          });
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'laith@example.com',
        password: 'Password123',
        firstName: 'Laith',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.accessToken).toBe('register-token');
      });
  });

  it('POST /auth/login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'laith@example.com', password: 'Password123' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBe('login-token');
      });
  });

  it('POST /auth/logout', () =>
    request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200)
      .expect({ message: 'Logged out successfully' }));

  it('GET /users/me', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .expect(200)
      .expect(({ body }) => expect(body.id).toBe('user-1'));
  });

  it('PATCH /users/me', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .send({ firstName: 'Updated', phone: '123456789' })
      .expect(200)
      .expect(({ body }) => expect(body.profile.firstName).toBe('Updated'));
  });

  it('GET /users/me/addresses', async () => {
    await request(app.getHttpServer())
      .get('/users/me/addresses')
      .expect(200)
      .expect(({ body }) => expect(body).toHaveLength(1));
  });

  it('POST /users/me/addresses', async () => {
    await request(app.getHttpServer())
      .post('/users/me/addresses')
      .send({
        recipientName: 'Laith',
        phone: '123456789',
        street: 'Main Street',
        city: 'Amman',
        country: 'Jordan',
        isDefault: true,
      })
      .expect(201)
      .expect(({ body }) => expect(body._id).toBe(address._id));
  });

  it('PATCH /users/me/addresses/:addressId', async () => {
    await request(app.getHttpServer())
      .patch(`/users/me/addresses/${address._id}`)
      .send({ street: 'Updated Street' })
      .expect(200)
      .expect(({ body }) => expect(body.street).toBe('Updated Street'));
  });

  it('DELETE /users/me/addresses/:addressId', async () => {
    await request(app.getHttpServer())
      .delete(`/users/me/addresses/${address._id}`)
      .expect(200)
      .expect({ message: 'Address deleted successfully' });
  });
});
