import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from '../ormconfig';
import { aiRouter, authRouter, homeRouter } from './routes';
import { setupSwagger } from './swagger/swagger';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT!) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// API routes
app.use('/auth', authRouter);
app.use('/api', homeRouter);
app.use('/ai', aiRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        app.listen(port, '0.0.0.0', () => {
            console.log('Server is running at: ' + port);
            console.log(
                'Swagger documentation available at: http://localhost:' + port + '/api-docs'
            );
        });
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
};

startServer();
