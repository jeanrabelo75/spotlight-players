import sinon from 'sinon';
import { expect } from 'chai';
import User from '../src/models/user.js';
import { changePassword } from '../src/services/changePasswordService.js';

describe('Change Password Service', () => {
  it('Deve alterar a senha do usuário com sucesso', async () => {
    const userMock = {
      email: 'test@example.com',
      password: 'oldHashedPassword',
      name: 'Test User',
      birthday: new Date('1990-01-01')
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(userMock);
    const email = 'test@example.com';
    const newPassword = 'newPassword123';

    try {
      await changePassword(email, newPassword);

      expect(findOneStub.calledOnceWithExactly({ email })).to.be.true;
      expect(userMock.password).to.not.equal('oldHashedPassword');
    } finally {
      findOneStub.restore();
    }
  });

  it('Deve lançar um erro ao tentar alterar a senha de um usuário inexistente', async () => {
    const findOneStub = sinon.stub(User, 'findOne').resolves(null);

    const email = 'nonexistent@example.com';
    const newPassword = 'newPassword123';

    try {
      await changePassword(email, newPassword);
    } catch (error) {
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal('No user found with this email.');
    } finally {
      findOneStub.restore();
    }
  });
});
