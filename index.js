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


const app = express();
const PORT = 80;
export const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.redirect('/login');
});



app.use('', auth);

app.use('/api/v1', tweet);

app.use('/api/v1', user);

app.use('', endpoints);


app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/* 

*/

