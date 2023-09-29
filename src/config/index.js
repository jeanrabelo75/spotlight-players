import { join } from 'path';
import express from 'express';
import pkg from 'body-parser';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import session from 'express-session';
import userRoutes from '../routes/userRoutes.js';
import loginRoutes from '../routes/loginRoutes.js';
import errorHandler from '../middlewares/errorHandler.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';

config({path: '../../.env'});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/spotlightplayers';
const SECRET_KEY = process.env.SECRET_KEY || '';

connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB successfully.');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

const app = express();
const PORT = 3000;
const { urlencoded, json } = pkg;

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.send('SpotLight Players');
});

// ROUTE - USERS
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.get('/logged', ensureAuthenticated, (req, res) => {
  res.sendFile(join(__dirname, './src/views/', 'logged.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Spotlight is listening on port ${PORT}`);
});
