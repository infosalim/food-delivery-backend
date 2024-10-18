import express, { Application } from 'express';
import { AdminRoute, ShoppingRoute, VendorRoute } from '../routes';
import bodyParser from 'body-parser';
import path from 'path';

const App = async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/admin', AdminRoute);
  app.use('/vendor', VendorRoute);
  app.use(ShoppingRoute);

  return app;
};

export default App;
