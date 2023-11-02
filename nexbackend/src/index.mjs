import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import fs from 'fs';
import { create } from 'domain';
import MongoStore from 'connect-mongo';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { mountUserEndpoints } from './handlers/users.mjs';
import { mountBankEndpoints } from './handlers/banks.mjs';
import { mountTransferEndpoints } from './handlers/transfer.mjs';


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Log requests to the console in a compact format:
app.use(logger('dev'));

// Full log of all requests to /log/access.log:
app.use(logger('common', {
    stream: fs.createWriteStream(join(__dirname, '..', 'log', 'access.log'), { flags: 'a' }),
}));

app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: {}, // Start with an empty object
        collectionName: 'user_sessions'
    }),
}));


// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use('/user', userRouter);

const transferRouter = express.Router();
mountTransferEndpoints(transferRouter);
app.use('/transfer', transferRouter);

const bankRouter = express.Router();
mountBankEndpoints(bankRouter);
app.use('/bank', bankRouter);

// Hello World page to check everything works:
app.get('/', async (_, res) => {
    return res.status(200).send({ message: "Hello, World!" });
});

let usersCollection = {};
let banksCollection = {};
let investCollection = {};
let logCollection = {};
let pendingCollection = {};

const port = 8000;
app.listen(port, async () => {
    await client.connect();
    const dbName = process.env.DBName;
    const usersCollectionname = "users";
    const banksCollectionname = "banks";
    const investCollectionname = "invest";
    const logCollectionname = "log";
    const pendingCollectionname = "pending";

    const database = client.db(dbName);
    usersCollection = database.collection(usersCollectionname);
    banksCollection = database.collection(banksCollectionname);
    investCollection = database.collection(investCollectionname);
    logCollection = database.collection(logCollectionname);
    pendingCollection = database.collection(pendingCollectionname);

    console.log(`CORS config: configured to respond to a frontend hosted on ${process.env.FRONTEND_URL}`);

});
export { usersCollection, banksCollection, investCollection, logCollection, pendingCollection };
