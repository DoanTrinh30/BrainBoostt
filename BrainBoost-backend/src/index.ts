import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from '../ormconfig';
import { aiRouter, authRouter, homeRouter } from './routes';
import adminRoutes from './routes/adminRoutes';
import { setupSwagger } from './swagger/swagger';
import { seedUsers } from './seeds/seedUsers';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT!) || 3000;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// API routes
app.use('/auth', authRouter);
app.use('/api', homeRouter);
app.use('/api/admin', adminRoutes);
app.use('/ai', aiRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Seed test accounts (optional)
    await seedUsers();

    app.listen(port, '0.0.0.0', () => {
      console.log('🚀 Server is running at: http://0.0.0.0:' + port);
      console.log(
        '📚 Swagger documentation available at: http://localhost:' + port + '/api-docs'
      );
    });
  } catch (error) {
    console.error('❌ Error connecting to database', error);
    process.exit(1);
  }
};

startServer();