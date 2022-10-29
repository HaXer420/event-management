const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Server connected with DB Successfully'))
  .catch((err) => {
    console.log('Connection Failed');
  });

const port = process.env.PORT || 6000;

console.log(`Server running in ${process.env.NODE_ENV} Mode`);

const server = app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
