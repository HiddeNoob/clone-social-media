import express, { response } from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {tweet} from "./routes/backend/api/tweet.js";
import {user} from "./routes/backend/api/user.js";
import {auth} from "./routes/backend/auth.js";
import {endpoints} from "./routes/frontend/endpoints.js";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 80;
export const __dirname = dirname(fileURLToPath(import.meta.url));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('common', { stream: accessLogStream }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// redirect if user already logged in
app.get('/login', (req, res) => {
    req.cookies.token ? res.redirect('/home') : res.sendFile(__dirname + '/public/loginPage/index.html');
});
app.get('/', (req, res) => {
    req.cookies.token ? res.redirect('/home') : res.sendFile(__dirname + '/public/loginPage/index.html');
});
//////////

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

/////////////////
app.use('',auth);

app.use('/api/v1', tweet);

app.use('/api/v1', user);

app.use('', endpoints);
////////////////////


app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/* 

*/



