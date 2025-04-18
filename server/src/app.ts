import cors from 'cors';
import express, { Response, Request } from 'express';
import { productsController } from './controllers/products.controller';
import { categoriesController } from './controllers/categories.controller';

export const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send("Cozy Corner Backend API");
});

// Module routes
app.use('/products', productsController);
app.use('/categories', categoriesController);
