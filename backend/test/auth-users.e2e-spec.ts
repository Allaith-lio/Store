import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { AdminController } from '../src/admin/admin.controller';
import { AdminService } from '../src/admin/admin.service';
import { CartsController } from '../src/carts/carts.controller';
import { CartsService } from '../src/carts/carts.services';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { User, UserRole } from '../src/users/schemas/user.schema';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { WishlistController } from '../src/wishlist/wishlist.controller';
import { WishlistService } from '../src/wishlist/wishlist.service';

describe('Authentication and profile endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let testRole = 'customer';

  const authService = {
    register: jest.fn().mockResolvedValue({
      accessToken: 'register-token',
      user: { id: 'user-1', email: 'laith@example.com' },
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'login-token',
      user: { id: 'user-1', email: 'laith@example.com' },
    }),
    logout: jest
      .fn()
      .mockResolvedValue({ message: 'Logged out successfully' }),
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
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'user-2',
        email: 'ziena@example.com',
        role: UserRole.Customer,
        profile: { firstName: 'Ziena' },
      },
    ]),
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

  const product = { _id: '507f1f77bcf86cd799439011', name: 'Test product' };
  const productsService = {
    findAll: jest.fn().mockResolvedValue({ data: [product], meta: { total: 1 } }),
    findOne: jest.fn().mockResolvedValue(product),
    create: jest.fn().mockResolvedValue(product),
    update: jest.fn().mockResolvedValue(product),
    remove: jest.fn().mockResolvedValue({ message: 'Product deleted successfully' }),
  };

  const adminService = {
    getAllOrders: jest.fn().mockResolvedValue([]),
    updateOrderStatus: jest.fn().mockResolvedValue({ _id: address._id }),
    getDashboardSummary: jest.fn().mockResolvedValue({ totalUsers: { value: 1 } }),
    getSalesChart: jest.fn().mockResolvedValue([{ label: 'Mon', value: 0 }]),
  };

  const cartResponse = { items: [], total: 0 };
  const cartsService = {
    getCart: jest.fn().mockResolvedValue(cartResponse),
    addItem: jest.fn().mockResolvedValue(cartResponse),
    updateItem: jest.fn().mockResolvedValue(cartResponse),
    removeItem: jest.fn().mockResolvedValue(cartResponse),
    clearCart: jest.fn().mockResolvedValue(cartResponse),
  };

  const wishlistService = {
    getWishlist: jest.fn().mockResolvedValue([product]),
    addItem: jest.fn().mockResolvedValue([product]),
    removeItem: jest.fn().mockResolvedValue([]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController,
        UsersController,
        ProductsController,
        AdminController,
        CartsController,
        WishlistController,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
        { provide: ProductsService, useValue: productsService },
        { provide: AdminService, useValue: adminService },
        { provide: CartsService, useValue: cartsService },
        { provide: WishlistService, useValue: wishlistService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: { switchToHttp: () => { getRequest: () => object } }) => {
          const request = context.switchToHttp().getRequest();
          Object.assign(request, {
            user: {
              sub: 'user-1',
              email: 'laith@example.com',
              role: testRole,
            },
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

  afterEach(() => {
    testRole = 'customer';
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

  it('blocks customer access to GET /users', () =>
    request(app.getHttpServer()).get('/users').expect(403));

  it('GET /users for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject({
          id: 'user-2',
          email: 'ziena@example.com',
          role: 'customer',
        });
      });
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

  it('GET /products', () =>
    request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(({ body }) => expect(body.data[0].name).toBe('Test product')));

  it('GET /products/:id', () =>
    request(app.getHttpServer())
      .get(`/products/${address._id}`)
      .expect(200)
      .expect(({ body }) => expect(body.name).toBe('Test product')));

  it('blocks customer access to product mutations', () =>
    request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test', description: 'Test', price: 1, category: 'Test' })
      .expect(403));

  it('POST /products for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test', description: 'Test', price: 1, category: 'Test' })
      .expect(201);
  });

  it('blocks customer access to product image uploads', () =>
    request(app.getHttpServer())
      .post('/products/images')
      .expect(403));

  it('requires an image for admin product image uploads', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .post('/products/images')
      .expect(400);
  });

  it('rejects invalid image content', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .post('/products/images')
      .attach('image', Buffer.from('not an image'), {
        filename: 'invalid.png',
        contentType: 'image/png',
      })
      .expect(400);
  });

  it('PATCH /products/:id for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .patch(`/products/${address._id}`)
      .send({ name: 'Updated' })
      .expect(200);
  });

  it('DELETE /products/:id for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .delete(`/products/${address._id}`)
      .expect(200);
  });

  it('protects admin routes from customer access', () =>
    request(app.getHttpServer()).get('/admin/orders').expect(403));

  it('GET /admin/orders for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer()).get('/admin/orders').expect(200);
  });

  it('PATCH /admin/orders/:id/status for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .patch(`/admin/orders/${address._id}/status`)
      .send({ status: 'processing' })
      .expect(200);
  });

  it('GET /admin/dashboard/summary for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .get('/admin/dashboard/summary')
      .expect(200);
  });

  it('GET /admin/dashboard/sales for an admin', async () => {
    testRole = 'admin';
    await request(app.getHttpServer())
      .get('/admin/dashboard/sales?range=week')
      .expect(200);
  });

  it('GET /cart', () =>
    request(app.getHttpServer())
      .get('/cart')
      .expect(200)
      .expect(cartResponse));

  it('POST /cart/items', () =>
    request(app.getHttpServer())
      .post('/cart/items')
      .send({ productId: address._id, quantity: 1 })
      .expect(201));

  it('PATCH /cart/items/:productId', () =>
    request(app.getHttpServer())
      .patch(`/cart/items/${address._id}`)
      .send({ quantity: 2 })
      .expect(200));

  it('DELETE /cart/items/:productId', () =>
    request(app.getHttpServer())
      .delete(`/cart/items/${address._id}`)
      .expect(200));

  it('DELETE /cart', () =>
    request(app.getHttpServer()).delete('/cart').expect(200));

  it('GET /users/me/wishlist', () =>
    request(app.getHttpServer())
      .get('/users/me/wishlist')
      .expect(200)
      .expect(({ body }) => expect(body).toHaveLength(1)));

  it('POST /users/me/wishlist/items', () =>
    request(app.getHttpServer())
      .post('/users/me/wishlist/items')
      .send({ productId: address._id })
      .expect(201));

  it('DELETE /users/me/wishlist/items/:productId', () =>
    request(app.getHttpServer())
      .delete(`/users/me/wishlist/items/${address._id}`)
      .expect(200));
});

describe('JWT revocation', () => {
  const userId = '507f1f77bcf86cd799439011';
  const user = {
    _id: new Types.ObjectId(userId),
    email: 'laith@example.com',
    role: UserRole.Customer,
    tokenVersion: 2,
  };
  const query = {
    select: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(user),
  };
  const userModel = {
    findById: jest.fn().mockReturnValue(query),
  } as unknown as Model<User>;
  const strategy = new JwtStrategy(
    new ConfigService({ JWT_SECRET: 'test-secret' }),
    userModel,
  );

  it('uses the current account role and token version', async () => {
    await expect(
      strategy.validate({
        sub: userId,
        email: 'stale@example.com',
        role: UserRole.Admin,
        tokenVersion: 2,
      }),
    ).resolves.toMatchObject({
      sub: userId,
      email: user.email,
      role: UserRole.Customer,
      tokenVersion: 2,
    });
  });

  it('rejects a token invalidated by logout', async () => {
    await expect(
      strategy.validate({
        sub: userId,
        email: user.email,
        role: UserRole.Customer,
        tokenVersion: 1,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('increments the token version on logout', async () => {
    const updateQuery = { exec: jest.fn().mockResolvedValue(user) };
    const findByIdAndUpdate = jest.fn().mockReturnValue(updateQuery);
    const model = {
      findByIdAndUpdate,
    } as unknown as Model<User>;
    const authService = new AuthService(model, {} as JwtService);

    await expect(authService.logout({ sub: userId })).resolves.toEqual({
      message: 'Logged out successfully',
    });
    expect(findByIdAndUpdate.mock.calls[0]).toEqual([
      userId,
      { $inc: { tokenVersion: 1 } },
      { returnDocument: 'after' },
    ]);
  });
});
