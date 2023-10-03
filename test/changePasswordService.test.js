import sinon from 'sinon';
import { expect } from 'chai';
import User from '../src/models/user.js';
import { changePassword } from '../src/services/changePasswordService.js';

describe('Change Password Service', () => {
  let findOneStub;
  let saveStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne');
    saveStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    findOneStub.restore();
    saveStub.restore();
  });

  it('Deve alterar a senha do usuário com sucesso', async () => {
    const email = 'test@example.com';
    const newPassword = 'newPassword123';
    const userMock = new User({
      email: email,
      password: 'oldHashedPassword'
    });

    findOneStub.withArgs({ email }).resolves(userMock);

    await changePassword(email, newPassword);

    expect(saveStub.calledOnce).to.be.true;
    expect(userMock.password).to.not.equal('oldHashedPassword');
  });

  it('Deve lançar um erro ao tentar alterar a senha de um usuário inexistente', async () => {
    const email = 'nonexistent@example.com';
    const newPassword = 'newPassword123';

    findOneStub.withArgs({ email }).resolves(null);

    try {
      await changePassword(email, newPassword);
    } catch (error) {
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal('Usuário não encontrado.');
    }
  });
});
