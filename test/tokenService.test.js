import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { generateToken } from '../src/services/tokenService.js';

describe('Token Service', () => {
  it('Deve gerar um token JWT válido', () => {
    const user = { id: '123', name: 'John Doe' };
    const token = generateToken(user);

    expect(token).to.be.a('string');
    expect(token).to.not.be.empty;
  });

  it('Deve gerar um token com a expiração correta', () => {
    const user = { id: '123', name: 'John Doe' };
    const token = generateToken(user);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    expect(expirationTime).to.be.above(currentTime);
  });
});
