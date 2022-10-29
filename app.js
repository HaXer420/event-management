const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  req.requestBody = new Date().toISOString();
  next();
});

app.all('*', (req, res, next) => {
  next(new AppError(`Couldn't fint the ${req.originalUrl} url`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
