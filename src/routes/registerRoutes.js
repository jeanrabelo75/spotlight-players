import { createUser, getUserByEmail } from '../services/userService.js';

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, birthday } = req.body;

    try {
      await getUserByEmail(email);
      return res.status(400).json({ error: 'Email already in use' });
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }

    const newUser = await createUser({
      email,
      password,
      name,
      birthday: new Date(birthday),
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    next(error);
  }
});
