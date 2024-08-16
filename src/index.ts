import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import http from 'http'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const port = 6969;
const MONGO_URL = process.env.MONGODB_URL;

const app = express();
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser());
app.use('/',router());

const server = http.createServer(app);
server.listen(port,()=>{
    console.log("Server running on port:", port);
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL, {dbName: 'hhd-db'})
.then(() => {
    console.log("Connected to Database!");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

