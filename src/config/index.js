// Packages
import cors from 'cors';
import express from 'express';
import pkg from 'body-parser';
import { config } from 'dotenv';
import { connect } from 'mongoose';

// Middlewares
import error from '../middlewares/error.js';

// Routes
import { router } from '../routes/routes.js';

config({path: '../../.env'});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/spotlightplayers';

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

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', (req, res) => {
    res.send('Spotlight Players');
});

app.use('/api', router);
app.use(error);

app.listen(PORT, () => {
    console.log(`Spotlight is listening on port ${PORT}`);
});
