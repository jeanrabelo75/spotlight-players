import { expect } from 'chai';
import { restore, stub } from 'sinon';
import User from '../src/models/user.js';
import { createUser, getUserByEmail } from '../src/services/userService.js';

describe('userService', () => {
  afterEach(() => {
    restore();
  });

  describe('createUser', () => {
    it('should throw an error if required fields are missing', async () => {
      const userData = { email: 'test@example.com' };

      try {
        await createUser(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('All fields (email, password, name) are required');
        expect(error.statusCode).to.equal(400);
      }
    });

    it('should throw a duplicate error if email already in use', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User'
      };

      const mockMongoError = new Error('MongoServer error');
      mockMongoError.name = 'MongoServerError';
      mockMongoError.code = 11000;

      stub(User, 'create').throws(mockMongoError);

      try {
        await createUser(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Email already in use.');
        expect(error.statusCode).to.equal(409);
      }
    });

    it('should create and return a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User'
      };

      const mockUser = {
        ...userData,
        _id: 'mockUserId'
      };

      stub(User, 'create').resolves(mockUser);

      const newUser = await createUser(userData);
      expect(newUser).to.deep.equal(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should throw an error if no user is found with the provided email', async () => {
      const email = 'test@example.com';

      stub(User, 'findOne').resolves(null);

      try {
        await getUserByEmail(email);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('No user found with this email.');
        expect(error.statusCode).to.equal(404);
      }
    });

    it('should return the user when found by email', async () => {
      const email = 'test@example.com';
      const mockUser = { email, _id: 'mockUserId' };

      stub(User, 'findOne').resolves(mockUser);

      const user = await getUserByEmail(email);
      expect(user).to.deep.equal(mockUser);
    });
  });
});
