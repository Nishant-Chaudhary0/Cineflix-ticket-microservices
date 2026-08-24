import express from 'express';
import cors from 'cors';
import dontenv from 'dotenv';
import { dbConnect } from './config/db.js';
import route from './routes/userRoutes.js';

dontenv.config();

const app = express();
const port = process.env.PORT || 3001;
dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", route);

app.listen(port, () => {
    console.log("auth server is running on port :", port);
})