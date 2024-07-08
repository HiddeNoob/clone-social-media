import express, { response } from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { generateAccessToken, checkAuthenticate } from "./jwt.js";
import morgan from "morgan";
import userAuth from './userAuth.js';

const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login',userAuth);

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/loginPage/index.html');
});

app.get('/home', checkAuthenticate, (req, res) => {
    res.sendFile(__dirname + '/public/homePage/index.html');
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


