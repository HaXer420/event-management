const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const userRouter = require('./routes/userRoute');
const eventRouter = require('./routes/eventRoute');
const societyandtypesRouter = require('./routes/societyandtypeRoutes');
const galleryRouter = require('./routes/galleryRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors());

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
  req.requestBody = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/societyandtypes', societyandtypesRouter);
app.use('/api/v1/gallery', galleryRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Couldn't fint the ${req.originalUrl} url`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
