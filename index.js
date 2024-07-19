import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { checkAuthenticate } from "./jwt.js";
import morgan from "morgan";
import userAuth from './userAuth.js';
import cookieParser from "cookie-parser";
import { getAllTweets} from "./public/api/api.js";



const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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



app.get('/api/v1/tweet',checkAuthenticate,async (req, res) => {
    try{
        const tweets = await getAllTweets()

        const message = await tweets.json()
        res.send(message);
    }
    catch(err){
        console.log(err);
        let error = {
            status: 500,
            message: err.message,
            data : null
        }
        res.send(error);
    }

});

app.get("/api/v1/tweet/like", checkAuthenticate, (req, res) => {
    let user = req.user;
    api
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFoundPage/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


