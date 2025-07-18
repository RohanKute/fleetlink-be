import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());


app.get('/', (req : Request, res: Response) => res.send('FleetLink API'));

app.listen(5000, () => console.log('Server running on port 5000'));
