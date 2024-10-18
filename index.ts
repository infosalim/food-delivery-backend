import express from 'express';
import * as dotenv from 'dotenv';
import App from './services/ExpressApp';
import dbConnection from './services/Database';

dotenv.config();

const StartServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(8000, () => {
    console.log('App is listening on PORT: 8000');
  });
};

StartServer();
