import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cors from 'cors';
import { dataSource }  from './api/models/dataSource.js'
import { router }  from './api/routes/index.js'
import { globalErrorHandler } from './api/utils/error.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(router);
app.use(globalErrorHandler);

const startServer = () => {
// Connection test
  dataSource.initialize()
  .then(() => {
    console.log('DATA_SOURCE_HAS_BEEN_INITIALIZED');
  })
  .catch((err) => {
    console.log('DATA_SOURCE_HAS_FAILED_TO_CONNECT_LOCAL_DATABASE', err)
  })

// Connection test
  app.get('/ping', (req, res) => {
    res.status(200).json({'message' : 'pong'});
  });

// Server start
  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
};
    
startServer();