import bcrypt from 'bcrypt';
import { expect } from 'chai';
import { restore, stub } from 'sinon';
import User from '../src/models/user.js';
import { authenticate } from '../src/services/loginService.js';

describe('loginService', () => {
  afterEach(() => {
    restore();
  });

  describe('authenticate', () => {
    it('should throw an error if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'test123';

      stub(User, 'findOne').resolves(null);

      try {
        await authenticate(email, password);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found');
        expect(error.statusCode).to.equal(401);
      }
    });

    it('should throw an error if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      const mockUser = { password: 'hashedPassword' };

      stub(User, 'findOne').resolves(mockUser);
      stub(bcrypt, 'compare').resolves(false);

      try {
        await authenticate(email, password);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Incorrect password');
        expect(error.statusCode).to.equal(401);
      }
    });

    it('should return user data if authentication is successful', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      const mockUser = { password: 'hashedPassword', email: email };

      stub(User, 'findOne').resolves(mockUser);
      stub(bcrypt, 'compare').resolves(true);

      const result = await authenticate(email, password);
      expect(result).to.deep.equal(mockUser);
    });
  });
});
