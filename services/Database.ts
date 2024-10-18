import mongoose from 'mongoose';
// import { MONGO_URI } from '../config';

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string).then(() => {
      console.log('Connected to MongoDB');
    });

    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('Mongoose connected to DB Cluster');
    });

    db.on('error', (error) => {
      console.error('Mongoose connection error:', error);
    });

    db.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
  } catch (ex) {
    console.log(ex);
  }
};

export default dbConnection;
