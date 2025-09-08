
import express from 'express';
import routes from './app-routes';
import config from './config';
import cors from 'cors';
import { connectToDatabase } from './config/mongodb';

// create express server
const app: express.Express = express();
app.use(express.json());
app.use(cors());

app.set('port', config.port);

// Immediately invoke the connectToDatabase function
(async () => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
})();

routes(app);
export default app;
