import User from '../models/user.js';
import { genSalt, hash } from 'bcrypt';

export async function changePassword(email, newPassword) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);
    user.password = hashedPassword;
    
    await user.save();
  } catch (error) {
    throw error;
  }
}
